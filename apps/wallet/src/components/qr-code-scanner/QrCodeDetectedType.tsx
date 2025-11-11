import React, { useContext, useEffect, useState } from 'react';

import { QrCodeType } from '@minotaur-ergo/types';
import { Button } from '@mui/material';

import MessageContext from '@/components/app/messageContext';
import LoadingPage from '@/components/loading-page/LoadingPage';
import StateMessage from '@/components/state-message/StateMessage';
import SvgIcon from '@/icons/SvgIcon';

import QrCodeTypes from './qrcode-types/types';

interface QrCodeDetectedTypePropsType {
  scanned: string;
  open: boolean;
  scanning: boolean;
  callback: (scanned: string) => unknown;
  callbackRequired: boolean;
  close: () => unknown;
}

const QrCodeDetectedType = (props: QrCodeDetectedTypePropsType) => {
  const [selectedType, setSelectedType] = useState<QrCodeType | undefined>();
  const [checked, setChecked] = useState('');
  const [checking, setChecking] = useState(false);
  const [data, setData] = useState('');
  const [invalidQrCode, setInvalidQrCode] = useState(false);
  const messageContext = useContext(MessageContext);
  useEffect(() => {
    if (props.scanned !== checked && !checking && props.open) {
      console.debug('start process detected type');
      setChecking(true);
      let found = false;
      for (const qrCodeType of QrCodeTypes) {
        const data = qrCodeType.detect(props.scanned);
        if (data) {
          if (qrCodeType.render === undefined && props.callbackRequired) {
            props.callback(props.scanned);
          } else {
            setData(data);
            setSelectedType(qrCodeType);
            found = true;
          }
          break;
        }
      }
      if (!found) {
        setSelectedType(undefined);
        setData('');
        if (props.callbackRequired) {
          messageContext.insert('Invalid QR code', 'error');
          props.close();
        } else {
          setInvalidQrCode(true);
        }
      } else {
        setInvalidQrCode(false);
      }
      setChecked(props.scanned);
      setChecking(false);
    }
  }, [checked, checking, props, messageContext]);
  useEffect(() => {
    if (!props.open) {
      setChecked('');
    }
  }, [props.open]);
  return (
    <React.Fragment>
      {checking ? <LoadingPage /> : undefined}
      {selectedType && selectedType.render
        ? selectedType.render(data, props.close)
        : undefined}
      {invalidQrCode && (
        <StateMessage
          title="Invalid QR Code"
          description="The scanned QR code is not recognized. Please scan a valid QR code."
          icon={<SvgIcon icon="warning" color="error" />}
          color="error.dark"
          action={
            <Button variant="contained" onClick={props.close}>
              Close
            </Button>
          }
        />
      )}
    </React.Fragment>
  );
};

export default QrCodeDetectedType;
