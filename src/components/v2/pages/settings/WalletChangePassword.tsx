import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, Stack } from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { useNavigate } from 'react-router-dom';

const WalletChangePassword = () => {
  const navigate = useNavigate();
  const handle_submit = () => {
    navigate(-1);
  };
  return (
    <AppFrame
      title="Change password"
      navigation={<BackButton />}
      toolbar={<Button onClick={handle_submit}>Submit</Button>}
    >
      <Stack spacing={2}>
        <PasswordField label="Wallet Password" />
        <PasswordField label="Repeat Password" />
        <PasswordField label="New Password" />
      </Stack>
    </AppFrame>
  );
};

export default WalletChangePassword;
