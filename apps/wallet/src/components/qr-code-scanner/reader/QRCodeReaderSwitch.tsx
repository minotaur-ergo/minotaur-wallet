import { Capacitor } from '@capacitor/core';

import QrCodeReaderCapacitor from './QrCodeReaderCapacitor';
import QrCodeReaderWeb from './QrCodeReaderWeb';

interface PropsType {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  closeQrCode: () => unknown;
  setSupportMultipleCamera: (supportMultiple: boolean) => unknown;
}

const QrCodeReaderSwitch = (props: PropsType) => {
  const platform = Capacitor.getPlatform();
  if (platform === 'android' || platform === 'ios') {
    return (
      <QrCodeReaderCapacitor
        handleScan={props.success}
        handleError={props.fail}
        setSupportMultipleCamera={props.setSupportMultipleCamera}
      />
    );
  }
  return (
    <QrCodeReaderWeb
      setSupportMultipleCamera={props.setSupportMultipleCamera}
      closeQrCode={props.closeQrCode}
      handleScan={props.success}
      handleError={props.fail}
    />
  );
};

export default QrCodeReaderSwitch;
