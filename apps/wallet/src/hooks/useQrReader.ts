import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { MutableRefObject, useEffect, useRef } from 'react';

const useQrReader = (
  scannedCallback: (scanned: string) => unknown,
  errorCallback: (error: unknown) => unknown,
  // selected: number = 0,
) => {
  const controller: MutableRefObject<IScannerControls | undefined> = useRef();
  useEffect(() => {
    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 500,
    });
    codeReader
      .decodeFromConstraints(
        { video: { facingMode: 'user' } },
        'qr-code-scanner-video',
        (result, error) => {
          if (result) scannedCallback(result.getText());
          if (error) errorCallback(error);
        },
      )
      .then((controls) => (controller.current = controls))
      .catch((error) => {
        errorCallback(error);
      });
    return () => {
      controller.current?.stop();
    };
  }, [scannedCallback, errorCallback]);
  return 0;
};

export default useQrReader;
