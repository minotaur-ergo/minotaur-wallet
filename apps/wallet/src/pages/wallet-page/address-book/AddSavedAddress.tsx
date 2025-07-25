import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Button, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { SavedAddressDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import AppFrame from '@/layouts/AppFrame';

const AddSavedAddress = () => {
  const navigate = useNavigate();
  const context = useContext(MessageContext);
  const qrcoce = useContext(QrCodeContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const handleSubmit = () => {
    if (name && address) {
      SavedAddressDbAction.getInstance()
        .saveNewEntity(name, address)
        .then(() => {
          navigate(-1);
        })
        .catch((err) => context.insert(err.message, 'error'));
    } else {
      context.insert('Name and Address are required', 'error');
    }
  };
  const startScan = () => {
    qrcoce
      .start()
      .then((value) => setAddress(value))
      .catch((exp) => console.log(exp));
  };
  return (
    <AppFrame
      title="Save New Address"
      navigation={<BackButtonRouter />}
      toolbar={<Button onClick={handleSubmit}>Add</Button>}
    >
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <TextField
          label="Address"
          value={address}
          onChange={({ target }) => setAddress(target.value)}
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
      </Stack>
    </AppFrame>
  );
};

export default AddSavedAddress;
