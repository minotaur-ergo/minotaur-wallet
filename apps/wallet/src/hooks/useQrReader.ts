import { MutableRefObject, useEffect, useRef } from 'react';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

const useQrReader = (
  scannedCallback: (scanned: string) => unknown,
  errorCallback: (error: unknown) => unknown,
  // selected: number = 0,
) => {
  const controller: MutableRefObject<IScannerControls | undefined> = useRef();
  useEffect(() => {
    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 200,
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
      .then((controls) => {
        console.log('initialized');
        if (controller.current) controller.current.stop();
        controller.current = controls;
      })
      .catch((error) => {
        console.log(`error ${error}`);
        errorCallback(error);
      });
    return () => {
      controller.current?.stop();
    };
  }, [scannedCallback, errorCallback]);
  return 0;
};

export default useQrReader;
