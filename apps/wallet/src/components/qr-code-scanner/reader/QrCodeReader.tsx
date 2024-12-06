import BackButton from '@/components/back-button/BackButton';
import QrCodeReaderSwitch from '@/components/qr-code-scanner/reader/QRCodeReaderSwitch';
import useChunks from '@/hooks/useChunks';
import { CameraswitchOutlined } from '@mui/icons-material';
import ContentPasteRounded from '@mui/icons-material/ContentPasteRounded';
import ScanQrBox from './ScanQrBox';
import CameraBox from './CameraBox';
import ScannedChunkStatus from '@/components/qr-code-scanner/reader/ScannedChunkStatus';
import AppFrame from '@/layouts/AppFrame';
import { readClipBoard } from '@/utils/clipboard';
import { IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

interface QrCodeReaderPropsType {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  closeQrCode: () => unknown;
}

const QrCodeReader = (props: QrCodeReaderPropsType) => {
  const [scanned, setScanned] = useState('');
  const { chunks, error, completed } = useChunks(scanned);
  const [multipleCamera, setMultipleCamera] = useState(false);
  const readClipboard = () => {
    readClipBoard().then((data) => {
      newData(data);
    });
  };
  const newData = useCallback((scanned: string) => {
    setScanned(scanned);
  }, []);
  useEffect(() => {
    if (completed) {
      props.success(completed);
    }
  }, [completed, props]);
  return (
    <AppFrame
      title="Scan QrCode"
      className="barcode-scanner-modal"
      navigation={<BackButton onClick={props.closeQrCode} />}
      actions={
        <div style={{ zIndex: 1 }}>
          <IconButton onClick={readClipboard}>
            <ContentPasteRounded />
          </IconButton>
          {multipleCamera ? (
            <IconButton>
              <CameraswitchOutlined />
            </IconButton>
          ) : null}
        </div>
      }
      toolbar={<ScannedChunkStatus error={error} chunks={chunks} />}
    >
      <QrCodeReaderSwitch
        {...props}
        setSupportMultipleCamera={setMultipleCamera}
        success={newData}
      />
      <CameraBox>
        <ScanQrBox>
          <div className="line" />
        </ScanQrBox>
      </CameraBox>
    </AppFrame>
  );
};

export default QrCodeReader;
