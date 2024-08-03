import AppFrame from '@/layouts/AppFrame';
import { IconButton, Stack } from '@mui/material';
import CameraBox from './CameraBox';
import ScanQrBox from './ScanQrBox';
import QrCodeReaderSwitch from './QRCodeReaderSwitch';
import { ChevronLeft } from '@mui/icons-material';
import Fab from '@mui/material/Fab';
import ContentPasteRounded from '@mui/icons-material/ContentPasteRounded';
import { readClipBoard } from '@/utils/clipboard';
import ActionContainer from '@/components/action-container/ActionContainer';

interface PropsType {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  closeQrCode: () => unknown;
}

const QrCodeReader = (props: PropsType) => {
  const readClipboard = () => {
    readClipBoard().then((data) => {
      props.success(data);
    });
  };
  return (
    <AppFrame
      className="barcode-scanner-modal"
      title="Scan QR Code"
      navigation={
        <IconButton onClick={() => props.closeQrCode()}>
          <ChevronLeft />
        </IconButton>
      }
    >
      <ActionContainer>
        <Stack spacing={2} direction="row">
          <QrCodeReaderSwitch {...props} />
          <Fab onClick={() => readClipboard()} color="primary">
            <ContentPasteRounded />
          </Fab>
        </Stack>
      </ActionContainer>
      <CameraBox>
        <ScanQrBox>
          <div className="line" />
        </ScanQrBox>
      </CameraBox>
    </AppFrame>
  );
};

export default QrCodeReader;
