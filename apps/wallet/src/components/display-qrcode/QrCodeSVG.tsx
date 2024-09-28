import { Typography } from '@mui/material';
import { QRCodeSVG as PackageQrCode } from 'qrcode.react';
import './QrCodeSVG.css';

interface QrCodeSVGPropsType {
  value: string;
}

const QrCodeSVG = (props: QrCodeSVGPropsType) => {
  return (
    <Typography className='qrcode-svg-container'>
      <PackageQrCode size={128} value={props.value} />
    </Typography>
  );
};

export default QrCodeSVG;
