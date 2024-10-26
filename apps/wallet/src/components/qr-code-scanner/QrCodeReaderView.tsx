import QrCodeReader from '@/components/qr-code-scanner/reader/QrCodeReader';
import { QrCodeContext } from './QrCodeContext';
import { QrCodeCallback } from '@/types/qrcode';
import React, { useCallback, useState } from 'react';

interface QrCodeReaderViewPropsType {
  children: React.ReactNode;
}

const QrCodeReaderView = (props: QrCodeReaderViewPropsType) => {
  const [open, setOpen] = React.useState(false);
  const [scanning, setScanning] = useState(false);
  const [callbacks, setCallbacks] = useState<Array<QrCodeCallback>>([]);
  const startScan = () => {
    return new Promise<string>((resolve, reject) => {
      setCallbacks([...callbacks, { resolve, reject }]);
      setScanning(true);
      setOpen(true);
    });
  };
  const fail = useCallback(() => {
    console.log('fail to scan qrcode');
  }, []);

  const stopScanning = () => {
    callbacks.forEach((item) => item.reject('Canceled by user'));
    setOpen(false);
    setScanning(false);
    setCallbacks([]);
  };

  const scannedQrCode = (scannedCode: string) => {
    console.log(scannedCode);
  };
  return (
    <QrCodeContext.Provider
      value={{
        start: startScan
      }}
    >
      {open && scanning && (
        <QrCodeReader
          closeQrCode={stopScanning}
          fail={fail}
          success={scannedQrCode}
        />
      )}
      <div style={{ display: open && !scanning ? 'block' : 'none' }}>
        <div>QrCode Detected Type</div>
      </div>

      <div style={{ display: open ? 'none' : 'block' }}>
        {props.children}
      </div>
    </QrCodeContext.Provider>
  );
};

export default QrCodeReaderView;