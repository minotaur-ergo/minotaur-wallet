import { QRCodeSVG as PackageQrCode } from 'qrcode.react';
import { memo } from 'react';

import { Box } from '@mui/material';

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

// qrcode.react encodes again on every render, so skip renders with same value
export default memo(QrCodeSVG);
