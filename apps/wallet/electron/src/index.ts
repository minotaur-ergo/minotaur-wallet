import type { CapacitorElectronConfig } from '@minotaur-ergo/electron';
import {
  getCapacitorElectronConfig,
  setupElectronDeepLinking,
} from '@minotaur-ergo/electron';
import type { MenuItemConstructorOptions } from 'electron';
import { app, ipcMain, MenuItem, shell } from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
import http from 'node:http';
import https from 'node:https';

import createMenuTemplate from './menuTemplate';
// import { autoUpdater } from 'electron-updater';

import {
  ElectronCapacitorApp,
  setupContentSecurityPolicy,
  setupReloadWatcher,
} from './setup';

type HttpHeaders = Record<string, string>;

type HttpOptions = {
  data?: unknown;
  disableRedirects?: boolean;
  headers?: HttpHeaders;
  method?: string;
  params?: Record<string, string | string[]>;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | 'document';
  url: string;
};

const USER_AGENT =
  process.env.MINOTAUR_HTTP_USER_AGENT ??
  'MinotaurWallet/4.0.0 (https://github.com/minotaur-ergo/minotaur)';

const appendParams = (url: string, params?: HttpOptions['params']) => {
  if (!params) return url;
  const nextUrl = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => nextUrl.searchParams.append(key, item));
    } else {
      nextUrl.searchParams.set(key, value);
    }
  });
  return nextUrl.toString();
};

const normalizeBody = (options: HttpOptions) => {
  if (options.data === undefined || options.data === null) return undefined;
  if (typeof options.data === 'string') return options.data;
  return JSON.stringify(options.data);
};

const normalizeHeaders = (headers: http.IncomingHttpHeaders): HttpHeaders =>
  Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : `${value ?? ''}`,
    ]),
  );

const withDefaultHeaders = (headers: HttpHeaders = {}) => ({
  'User-Agent': USER_AGENT,
  'Accept': 'application/json, text/plain, */*',
  ...headers,
});

const parseResponseData = (
  body: Buffer,
  headers: HttpHeaders,
  responseType?: string,
) => {
  const contentType = headers['content-type'] ?? '';

  if (responseType === 'arraybuffer' || responseType === 'blob') {
    return body.toString('base64');
  }

  const text = body.toString('utf8');
  if (responseType === 'text') {
    return text;
  }

  if (contentType.includes('application/json') || responseType === 'json') {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

const sendNodeHttpRequest = (
  targetUrl: URL,
  options: HttpOptions,
): Promise<{
  data: unknown;
  headers: HttpHeaders;
  status: number;
  url: string;
}> =>
  new Promise((resolve, reject) => {
    const body = normalizeBody(options);
    const transport = targetUrl.protocol === 'https:' ? https : http;

    // Electron makes this request from Node, so browser CORS does not apply.
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
        const chunks: Buffer[] = [];
        upstreamResponse.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
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

const httpRequest = (options: HttpOptions) => {
  const targetUrl = new URL(appendParams(options.url, options.params));

  // Only proxy normal HTTP URLs. This avoids exposing local files or custom protocols.
  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    throw new Error('Only http and https URLs are allowed');
  }

  return sendNodeHttpRequest(targetUrl, options);
};

// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  new MenuItem({ label: 'Quit App', role: 'quit' }),
];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] =
  createMenuTemplate;

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig =
  getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(
  capacitorFileConfig,
  trayMenuTemplate,
  appMenuBarMenuTemplate,
);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol:
      capacitorFileConfig.electron.deepLinkingCustomProtocol ??
      'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady();

  ipcMain.on('openUrl', (event, url: string) => {
    shell.openExternal(url);
  });

  // Renderer calls this instead of fetch when running in Electron.
  ipcMain.handle('httpRequest', (_event, options: HttpOptions) =>
    httpRequest(options),
  );
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.
  // autoUpdater.checkForUpdatesAndNotify();
})();

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

// Place all ipc or other electron api calls and custom functionality under this line
