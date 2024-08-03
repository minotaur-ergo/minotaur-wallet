import { QRCodeSVG as PackageQrCode } from 'qrcode.react';
import { useEffect, useState } from 'react';

interface QrCodeSVGPropsType {
  value: string;
}
const QrCodeSVG = (props: QrCodeSVGPropsType) => {
  const [size, setSize] = useState(512);
  const [clientSize, setClientSize] = useState(0);
  useEffect(() => {
    const newSize = Math.min(window.screen.width, window.screen.height);
    if (newSize !== clientSize) {
      setClientSize(newSize);
      const pow = Math.min(Math.floor(Math.log(newSize) / Math.log(2)), 9);
      setSize(Math.pow(2, pow));
    }
  }, [size, clientSize]);
  return <PackageQrCode size={size} value={props.value} />;
};

export default QrCodeSVG;
