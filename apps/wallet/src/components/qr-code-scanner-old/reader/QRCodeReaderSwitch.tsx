import { Capacitor } from '@capacitor/core';
import QrCodeReaderWeb from './QrCodeReaderWeb';
import QrCodeReaderCapacitor from './QrCodeReaderCapacitor';

interface QrCodeReaderSwitchPropsType {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  closeQrCode: () => unknown;
}

const QrCodeReaderSwitch = (props: QrCodeReaderSwitchPropsType) => {
  const platform = Capacitor.getPlatform();
  if (platform === 'android' || platform === 'ios') {
    return (
      <QrCodeReaderCapacitor
        handleScan={props.success}
        handleError={props.fail}
      />
    );
  }
  return (
    <QrCodeReaderWeb
      closeQrCode={props.closeQrCode}
      handleScan={props.success}
      handleError={props.fail}
    />
  );
};

export default QrCodeReaderSwitch;
