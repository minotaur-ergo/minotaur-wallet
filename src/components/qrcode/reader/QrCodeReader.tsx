import React from 'react';
import { Capacitor } from '@capacitor/core';
import QrCodeReaderWeb from './QrCodeReaderWeb';
import QrCodeReaderCapacitor from './QrCodeReaderCapacitor';

interface PropsType {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  closeQrCode: () => unknown;
}

const QrCodeReader = (props: PropsType) => {
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
      closeQrcode={props.closeQrCode}
      handleScan={props.success}
      handleError={props.fail}
    />
  );
};

export default QrCodeReader;
