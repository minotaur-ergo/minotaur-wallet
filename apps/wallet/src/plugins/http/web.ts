import {
  Capacitor,
  CapacitorHttp as NativeCapacitorHttp,
} from '@capacitor/core';

import type {
  CapacitorHttpPlugin,
  HttpOptions,
  HttpResponse,
} from './definition';

const LOCAL_PROXY_URL = 'http://127.0.0.1:3001/proxy';

type ElectronHttpApi = typeof window.electronApi & {
  httpRequest?: (options: HttpOptions) => Promise<HttpResponse>;
};

const isNativePlatform = () => {
  const platform = Capacitor.getPlatform();
  return platform === 'android' || platform === 'ios';
};

const isElectronPlatform = () => Capacitor.getPlatform() === 'electron';

const requestViaLocalProxy = async (
  options: HttpOptions,
): Promise<HttpResponse> => {
  const response = await fetch(LOCAL_PROXY_URL, {
    body: JSON.stringify(options),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Local HTTP proxy failed: ${message}`);
  }

  return response.json();
};

class MinotaurHttpPlugin implements CapacitorHttpPlugin {
  async request(options: HttpOptions): Promise<HttpResponse> {
    // Android and iOS already have native Capacitor HTTP.
    if (isNativePlatform()) {
      return NativeCapacitorHttp.request(options);
    }

    // Electron requests go through preload.ts -> electron/src/index.ts.
    if (isElectronPlatform()) {
      const electronApi = window.electronApi as ElectronHttpApi;
      if (!electronApi.httpRequest) {
        throw new Error('Electron HTTP bridge is not available.');
      }
      return electronApi.httpRequest(options);
    }

    // Local browser requests go through the dev proxy started by npm run dev.
    return requestViaLocalProxy(options);
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

  delete(options: HttpOptions): Promise<HttpResponse> {
    return this.request({ ...options, method: 'DELETE' });
  }
}

export const CapacitorHttp = new MinotaurHttpPlugin();
