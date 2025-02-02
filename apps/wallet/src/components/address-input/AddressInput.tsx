import AddressBookModal from '@/components/modals/address-book-modal/AddressBookModal';
import useDrawer from '@/hooks/useDrawer';
import React from 'react';
import { BookOutlined } from '@mui/icons-material';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TextField from '@/components/text-field/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useContext, useEffect } from 'react';
import { readClipBoard } from '@/utils/clipboard';
import { isValidAddress } from '@/utils/functions';
import { QrCodeContext } from '../qr-code-scanner/QrCodeContext';

interface AddressInputPropsType {
  address: string;
  setAddress: (address: string) => unknown;
  label: string;
  setHasError: (hasError: boolean) => unknown;
}
const AddressInput = (props: AddressInputPropsType) => {
  const drawer = useDrawer();
  const loadFromClipboard = () => {
    readClipBoard().then((data) => {
      props.setAddress(data);
    });
  };
  const qrcode = useContext(QrCodeContext);
  const hasError = !isValidAddress(props.address);
  useEffect(() => {
    props.setHasError(!isValidAddress(props.address));
  });
  const startScan = () => {
    qrcode
      .start()
      .then((value) => {
        props.setAddress(value);
      })
      .catch((reason) => console.log(reason));
  };
  return (
    <React.Fragment>
      <TextField
        label={props.label}
        value={props.address}
        onChange={(event) => props.setAddress(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={drawer.handleOpen}>
                <BookOutlined />
              </IconButton>
              <IconButton onClick={startScan}>
                <QrCodeScannerIcon />
              </IconButton>
              <IconButton edge="end" onClick={loadFromClipboard}>
                <ContentPasteRoundedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText={hasError ? 'Invalid address' : ''}
      />
      <AddressBookModal
        open={drawer.open}
        onClose={drawer.handleClose}
        address={props.address}
        onChange={(item) => props.setAddress(item.address)}
      />
    </React.Fragment>
  );
};

export default AddressInput;
