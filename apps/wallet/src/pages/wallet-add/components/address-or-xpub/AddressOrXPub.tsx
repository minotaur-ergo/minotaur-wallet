import { useContext, useEffect } from 'react';

import { isValidAddress } from '@minotaur-ergo/utils';
import { getBase58ExtendedPublicKey } from '@minotaur/common';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { IconButton, InputAdornment } from '@mui/material';

import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import TextField from '@/components/text-field/TextField';

interface AddressOrXPubPropsType {
  value: string;
  setValue: (value: string) => unknown;
  setHasError: (hasError: boolean) => unknown;
  label: string;
}

const AddressOrXPub = (props: AddressOrXPubPropsType) => {
  useEffect(() => {
    props.setHasError(
      !isValidAddress(props.value) &&
        getBase58ExtendedPublicKey(props.value) === undefined,
    );
  });
  const qrcode = useContext(QrCodeContext);
  const startScan = () => {
    qrcode
      .start()
      .then((value) => props.setValue(value))
      .catch((exp) => console.log(exp));
  };
  return (
    <TextField
      value={props.value}
      onChange={({ target }) => props.setValue(target.value)}
      label={props.label}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={startScan}>
              <QrCodeScannerIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default AddressOrXPub;
