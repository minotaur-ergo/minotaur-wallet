import MessageContext from '@/components/app/messageContext';
import { QrCodePropsType } from '@/types/qrcode';
import { useContext, useEffect, useState } from 'react';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Fab } from '@mui/material';
import { CameraswitchOutlined } from '@mui/icons-material';
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
        const listener = await BarcodeScanner.addListener(
          'barcodeScanned',
          async (result) => {
            const boxPosition = getCameraBoxBoundary();
            const cornerPoints = result.barcode.cornerPoints;
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
              await listener.remove();
              await stop();
              props.handleScan(result.barcode.rawValue);
            }
          },
        );
        document.body.classList.add('barcode-scanner-active');
        await BarcodeScanner.startScan({
          lensFacing: usedCamera,
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
      }),
    );
    setUsedCamera(newFace);
  };

  const stop = async () => {
    document.body.classList.remove('barcode-scanner-active');
    await BarcodeScanner.stopScan();
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
