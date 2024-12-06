import { Box } from '@mui/material';
import { QRCodeSVG as PackageQrCode } from 'qrcode.react';
import './QrCodeSVG.css';

interface QrCodeSVGPropsType {
  value: string;
}

const QrCodeSVG = (props: QrCodeSVGPropsType) => {
  return (
    <Box className="qrcode-svg-container">
      <PackageQrCode size={128} value={props.value} />
    </Box>
  );
};

export default QrCodeSVG;
