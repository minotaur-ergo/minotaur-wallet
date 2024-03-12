import { QRCodeSVG as PackageQrCode } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

interface QrCodeSVGPropsType {
  value: string;
}
const QrCodeSVG = (props: QrCodeSVGPropsType) => {
  const [size, setSize] = useState(512);
  const [clientSize, setClientSize] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const newSize = Math.min(rect.width, rect.height);
      if (newSize !== clientSize) {
        setClientSize(newSize);
        const pow = Math.min(Math.floor(Math.log(newSize) / Math.log(2)), 9);
        setSize(Math.pow(2, pow));
      }
    }
  }, [size, ref, clientSize]);
  return (
    <div ref={ref}>
      <PackageQrCode size={size} value={props.value} />
    </div>
  );
};

export default QrCodeSVG;
