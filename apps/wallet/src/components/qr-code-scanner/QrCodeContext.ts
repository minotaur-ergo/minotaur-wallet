import { createContext } from 'react';

import { QrCodeContextType } from '@minotaur-ergo/types';

const QrCodeContext = createContext<QrCodeContextType>({
  start: () => Promise.resolve(''),
  paste: () => Promise.resolve(),
});

export { QrCodeContext };
