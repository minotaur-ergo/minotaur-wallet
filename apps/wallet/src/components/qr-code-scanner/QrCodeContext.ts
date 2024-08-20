import { QrCodeContextType } from '@/types/qrcode';
import { createContext } from 'react';

const QrCodeContext = createContext<QrCodeContextType>({
  start: () => Promise.resolve(''),
});

export { QrCodeContext };
