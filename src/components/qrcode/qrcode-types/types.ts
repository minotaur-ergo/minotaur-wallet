import React from 'react';

export interface QrCodeContextType {
  qrCode: boolean;
  showQrCode: React.Dispatch<boolean>;
  value: string;
  cleanValue: () => unknown;
}
