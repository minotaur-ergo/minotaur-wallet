import { spawn } from 'node:child_process';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const HOST = process.env.MINOTAUR_HTTP_PROXY_HOST ?? '127.0.0.1';
const PORT = Number(process.env.MINOTAUR_HTTP_PROXY_PORT ?? 3001);
const ALLOWED_ORIGIN = process.env.MINOTAUR_HTTP_PROXY_ORIGIN ?? '*';
const USER_AGENT =
  process.env.MINOTAUR_HTTP_USER_AGENT ??
  'MinotaurWallet/4.0.0 (https://github.com/minotaur-ergo/minotaur)';

const readRequestBody = (request) =>
  new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });

const writeJson = (response, status, data) => {
  response.writeHead(status, {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(data));
};

const appendParams = (url, params) => {
  if (!params) return url;
  const nextUrl = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => nextUrl.searchParams.append(key, item));
    } else {
      nextUrl.searchParams.set(key, value);
    }
  }
  return nextUrl.toString();
};

const normalizeBody = (options) => {
  if (options.data === undefined || options.data === null) return undefined;
  if (typeof options.data === 'string') return options.data;
  return JSON.stringify(options.data);
};

const normalizeHeaders = (headers) =>
  Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : `${value ?? ''}`,
    ]),
  );

const withDefaultHeaders = (headers = {}) => ({
  'User-Agent': USER_AGENT,
  'Accept': 'application/json, text/plain, */*',
  ...headers,
});

const parseResponseData = (body, headers, responseType) => {
  const contentType = headers['content-type'] ?? '';

  if (responseType === 'arraybuffer' || responseType === 'blob') {
    return body.toString('base64');
  }

  const text = body.toString('utf8');
  if (responseType === 'text') return text;

  if (contentType.includes('application/json') || responseType === 'json') {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

const sendUpstreamRequest = (targetUrl, options) =>
  new Promise((resolve, reject) => {
    const body = normalizeBody(options);
    const transport = targetUrl.protocol === 'https:' ? https : http;

    const upstream = transport.request(
      targetUrl,
      {
        headers: {
          ...withDefaultHeaders(options.headers),
          ...(body === undefined
            ? {}
            : { 'Content-Length': Buffer.byteLength(body) }),
        },
        method: options.method ?? 'GET',
      },
      (upstreamResponse) => {
        const chunks = [];
        upstreamResponse.on('data', (chunk) => chunks.push(chunk));
        upstreamResponse.on('end', () => {
          const headers = normalizeHeaders(upstreamResponse.headers);
          resolve({
            data: parseResponseData(
              Buffer.concat(chunks),
              headers,
              options.responseType,
            ),
            headers,
            status: upstreamResponse.statusCode ?? 0,
            url: targetUrl.toString(),
          });
        });
      },
    );

    upstream.on('error', reject);
    if (body !== undefined) upstream.write(body);
    upstream.end();
  });

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    writeJson(response, 204, {});
    return;
  }

  if (request.method !== 'POST' || request.url !== '/proxy') {
    writeJson(response, 404, { error: 'Not found' });
    return;
  }

  try {
    const options = JSON.parse(await readRequestBody(request));
    const targetUrl = new URL(appendParams(options.url, options.params));

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      writeJson(response, 400, {
        error: 'Only http and https URLs are allowed',
      });
      return;
    }

    writeJson(response, 200, await sendUpstreamRequest(targetUrl, options));
  } catch (error) {
    writeJson(response, 500, {
      error: error instanceof Error ? error.message : `${error}`,
    });
  }
});

const vite = spawn('npx', ['vite', '--host'], {
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

const shutdown = (signal) => {
  server.close();
  vite.kill(signal);
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

vite.on('exit', (code) => {
  server.close();
  if (code && code !== 0) {
    process.exit(code);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Minotaur HTTP proxy listening on http://${HOST}:${PORT}`);
});
