import { registerPlugin } from '@capacitor/core';

import type { HttpPlugin } from './definitions';

const CapacitorHttp = registerPlugin<HttpPlugin>('Http', {
  web: () => import('./web').then((m) => new m.HttpWeb()),
  electron: () =>
    (
      window as typeof window & {
        CapacitorCustomPlatform: {
          plugins: { Http: HttpPlugin };
        };
      }
    ).CapacitorCustomPlatform.plugins.Http,
});

export * from './definitions';
export { CapacitorHttp, CapacitorHttp as Http };
