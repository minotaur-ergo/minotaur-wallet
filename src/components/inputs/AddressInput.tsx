import React, { useContext, useEffect, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { QrCodeContextType } from '../qrcode/qrcode-types/types';

interface PropsType {
  address: string;
  contextType: React.Context<QrCodeContextType | null>;
  label: string;
  error?: string;
  setAddress: (password: string) => unknown;
  size?: 'small' | 'medium';
}

const AddressInput = (props: PropsType) => {
  const [blurred, setBlurred] = useState(false);
  const [scanning, setScanning] = useState(false);
  const context = useContext(props.contextType);
  const startQrCodeScanner = () => {
    setScanning(true);
    if (context) {
      context.showQrCode(true);
    }
  };
  useEffect(() => {
    if (scanning) {
      if (context && context.value) {
        context.cleanValue();
        context.showQrCode(false);
        props.setAddress(context.value);
      }
    }
  });
  return (
    <FormControl fullWidth variant="outlined" margin={'none'}>
      <TextField
        size={props.size ? props.size : 'medium'}
        variant="outlined"
        label={props.label}
        error={props.error !== '' && blurred}
        onBlur={() => setBlurred(true)}
        type="text"
        value={props.address}
        onChange={(event) => props.setAddress(event.target.value)}
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => startQrCodeScanner()}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                <FontAwesomeIcon icon={faQrcode} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {blurred && props.error ? (
        <FormHelperText error id="accountId-error">
          {props.error}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default AddressInput;
