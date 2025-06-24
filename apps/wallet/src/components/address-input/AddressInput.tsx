import React from 'react';
import { useContext, useEffect } from 'react';

import { BookOutlined } from '@mui/icons-material';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { NetworkPrefix } from 'ergo-lib-wasm-browser';

import AddressBookModal from '@/components/modals/address-book-modal/AddressBookModal';
import TextField from '@/components/text-field/TextField';
import useDrawer from '@/hooks/useDrawer';
import { readClipBoard } from '@/utils/clipboard';
import { isValidAddress } from '@/utils/functions';

import { QrCodeContext } from '../qr-code-scanner/QrCodeContext';

interface AddressInputPropsType {
  address: string;
  setAddress: (address: string) => unknown;
  label: string;
  setHasError: (hasError: boolean) => unknown;
  network: NetworkPrefix;
  useAddressBook?: boolean;
  suffix?: React.ReactElement;
  showError?: boolean;
}

const AddressInput = (props: AddressInputPropsType) => {
  const drawer = useDrawer();
  const useAddressBook = props.useAddressBook ?? true;
  const loadFromClipboard = () => {
    readClipBoard().then((data) => {
      props.setAddress(data);
    });
  };
  const qrcode = useContext(QrCodeContext);
  const hasError = !isValidAddress(props.address, props.network);
  useEffect(() => {
    props.setHasError(!isValidAddress(props.address, props.network));
  }, [props, props.address, hasError]);
  const startScan = () => {
    qrcode
      .start()
      .then((value) => {
        props.setAddress(value);
      })
      .catch((reason) => console.log(reason));
  };
  const showError = props.showError ?? true;
  return (
    <React.Fragment>
      <TextField
        label={props.label}
        value={props.address}
        onChange={(event) => props.setAddress(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {useAddressBook ? (
                <IconButton onClick={drawer.handleOpen}>
                  <BookOutlined />
                </IconButton>
              ) : null}
              <IconButton onClick={startScan}>
                <QrCodeScannerIcon />
              </IconButton>
              <IconButton edge="end" onClick={loadFromClipboard}>
                <ContentPasteRoundedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={hasError}
        helperText={showError && hasError ? 'Invalid address' : ''}
      />
      {useAddressBook ? (
        <AddressBookModal
          open={drawer.open}
          onClose={drawer.handleClose}
          address={props.address}
          onChange={(item) => props.setAddress(item.address)}
        />
      ) : null}
    </React.Fragment>
  );
};

export default AddressInput;
