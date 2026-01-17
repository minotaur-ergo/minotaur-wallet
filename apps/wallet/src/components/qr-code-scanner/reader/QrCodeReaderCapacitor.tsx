import { useContext, useEffect, useState } from 'react';

import {
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { QrCodePropsType } from '@minotaur-ergo/types';
import { CameraswitchOutlined } from '@mui/icons-material';
import { Fab } from '@mui/material';

import MessageContext from '@/components/app/messageContext';
import { getCameraBoxBoundary } from '@/utils/qrcode';

const QrCodeReaderCapacitor = (props: QrCodePropsType) => {
  const message = useContext(MessageContext);
  const [usedCamera, setUsedCamera] = useState(LensFacing.Back);
  const [started, setStarted] = useState(false);
  const checkPermission = async () => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted';
  };

  const start = async () => {
    if (!started) {
      if (await checkPermission()) {
        await BarcodeScanner.addListener('barcodesScanned', async (result) => {
          const boxPosition = getCameraBoxBoundary();
          if (result.barcodes.length === 0) {
            return;
          }
          const cornerPoints = result.barcodes[0].cornerPoints;
          if (cornerPoints) {
            const xs = cornerPoints.map((item) => item[0]);
            const ys = cornerPoints.map((item) => item[1]);
            if (
              Math.min(...xs) < boxPosition.left ||
              Math.max(...xs) > boxPosition.right ||
              Math.min(...ys) < boxPosition.top ||
              Math.max(...ys) > boxPosition.bottom
            ) {
              return;
            }
            props.handleScan(result.barcodes[0].rawValue);
          }
        });
        document.body.classList.add('barcode-scanner-active');
        await BarcodeScanner.startScan({
          lensFacing: usedCamera,
          formats: [BarcodeFormat.QrCode],
        });
        setStarted(true);
      } else {
        message.insert('No permission to use camera', 'error');
      }
    }
  };

  const changeCamera = async () => {
    const newFace =
      usedCamera === LensFacing.Back ? LensFacing.Front : LensFacing.Back;
    BarcodeScanner.stopScan().then(() =>
      BarcodeScanner.startScan({
        lensFacing: newFace,
        formats: [BarcodeFormat.QrCode],
      }),
    );
    setUsedCamera(newFace);
  };

  const stop = async () => {
    document.body.classList.remove('barcode-scanner-active');
    await BarcodeScanner.stopScan();
    await BarcodeScanner.removeAllListeners();
  };

  useEffect(() => {
    start()
      .then(() => null)
      .catch(() => props.handleError());
    return () => {
      stop().then(() => null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fab onClick={changeCamera}>
      <CameraswitchOutlined />
    </Fab>
  );
};

export default QrCodeReaderCapacitor;
