import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const AddAddress = () => {
  const navigate = useNavigate();
  const handle_submit = () => {
    navigate(-1);
  };

  return (
    <AppFrame
      title="Add New Address"
      navigation={<BackButton />}
      toolbar={<Button onClick={handle_submit}>Add</Button>}
    >
      <Stack spacing={2}>
        <TextField label="Name" />
        <TextField
          label="Address"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
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

export default AddAddress;
