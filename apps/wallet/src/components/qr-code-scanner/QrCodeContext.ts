import { createContext } from 'react';

import { QrCodeContextType } from '@/types/qrcode';

const QrCodeContext = createContext<QrCodeContextType>({
  start: () => Promise.resolve(''),
});

export { QrCodeContext };
