import { Buffer } from 'node:buffer';

type HttpHeaders = Record<string, string>;
type HttpParams = Record<string, string | string[]>;
type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text' | 'document';

interface HttpOptions {
  connectTimeout?: number;
  data?: unknown;
  disableRedirects?: boolean;
  headers?: HttpHeaders;
  method?: string;
  params?: HttpParams;
  readTimeout?: number;
  responseType?: HttpResponseType;
  shouldEncodeUrlParams?: boolean;
  url: string;
}

interface HttpResponse {
  data: unknown;
  headers: HttpHeaders;
  status: number;
  url: string;
}

const buildUrl = (options: HttpOptions): string => {
  const url = new URL(options.url);

  Object.entries(options.params ?? {}).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => url.searchParams.append(key, item));
  });

  return url.toString();
};

const buildBody = (options: HttpOptions): BodyInit | undefined => {
  if (options.data === undefined || options.data === null) return undefined;
  if (typeof options.data === 'string') return options.data;

  const contentType = Object.entries(options.headers ?? {}).find(
    ([key]) => key.toLowerCase() === 'content-type',
  )?.[1];

  if (contentType?.includes('application/x-www-form-urlencoded')) {
    return new URLSearchParams(options.data as Record<string, string>);
  }

  return JSON.stringify(options.data);
};

const parseResponse = async (
  response: Response,
  responseType?: HttpResponseType,
): Promise<unknown> => {
  if (responseType === 'arraybuffer' || responseType === 'blob') {
    return Buffer.from(await response.arrayBuffer()).toString('base64');
  }

  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  if (responseType === 'json' || contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

export class Http {
  async request(options: HttpOptions): Promise<HttpResponse> {
    const timeout = Math.max(
      options.connectTimeout ?? 0,
      options.readTimeout ?? 0,
    );
    const response = await fetch(buildUrl(options), {
      body: buildBody(options),
      headers: options.headers,
      method: options.method ?? 'GET',
      redirect: options.disableRedirects ? 'manual' : 'follow',
      signal: timeout > 0 ? AbortSignal.timeout(timeout) : undefined,
    });
    const headers = Object.fromEntries(response.headers.entries());

    return {
      data: await parseResponse(response, options.responseType),
      headers,
      status: response.status,
      url: response.url,
    };
  }

  get(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'GET' });
  }

  post(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'POST' });
  }

  put(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'PUT' });
  }

  patch(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'PATCH' });
  }

  del(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'DELETE' });
  }
}
