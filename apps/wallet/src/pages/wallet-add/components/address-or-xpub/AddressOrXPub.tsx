import { useContext, useEffect } from 'react';
import TextField from '@/components/text-field/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { getBase58ExtendedPublicKey, isValidAddress } from '@/utils/functions';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';

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
