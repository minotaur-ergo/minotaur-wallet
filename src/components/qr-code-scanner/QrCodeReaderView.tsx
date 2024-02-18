import React, { useCallback, useState } from 'react';
import { QrCodeContext } from './QrCodeContext';
import QrCodeReader from './reader/QrCodeReader';
import { QrCodeCallback } from '@/types/qrcode';
import QrCodeDetectedType from './QrCodeDetectedType';

interface QrCodeScannerWebPropsType {
  children: React.ReactNode;
}
const QrCodeReaderView = (props: QrCodeScannerWebPropsType) => {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [callbacks, setCallbacks] = useState<Array<QrCodeCallback>>([]);
  const [scanned, setScanned] = useState('');
  const startScan = () => {
    return new Promise<string>((resolve, reject) => {
      setCallbacks([...callbacks, { resolve, reject }]);
      setScanning(true);
      setOpen(true);
    });
  };
  const stopScanning = () => {
    callbacks.forEach((item) => item.reject('Canceled by user'));
    setOpen(false);
    setScanning(false);
    setCallbacks([]);
  };

  const scannedQrCode = (scannedCode: string) => {
    setScanned(scannedCode);
    setScanning(false);
  };

  const fail = useCallback(() => {
    console.log('fail to scan qrcode');
  }, []);

  const success = useCallback(
    (scanned: string) => {
      callbacks.map((item) => item.resolve(scanned));
      setOpen(false);
      setScanning(false);
      setCallbacks([]);
      setScanned('');
    },
    [callbacks],
  );
  const close = () => {
    setOpen(false);
    setScanning(false);
    setCallbacks([]);
    setScanned('');
  };
  return (
    <QrCodeContext.Provider
      value={{
        start: startScan,
      }}
    >
      {!open ? null : (
        <React.Fragment>
          {scanning ? (
            <QrCodeReader
              closeQrCode={stopScanning}
              fail={fail}
              success={scannedQrCode}
            />
          ) : null}
        </React.Fragment>
      )}
      <QrCodeDetectedType
        scanned={scanned}
        open={open}
        scanning={scanning}
        callback={success}
        close={close}
      >
        {props.children}
      </QrCodeDetectedType>
    </QrCodeContext.Provider>
  );
};

export default QrCodeReaderView;
