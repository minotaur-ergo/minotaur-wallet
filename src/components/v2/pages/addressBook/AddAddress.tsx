import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddAddress = () => {
  const navigate = useNavigate();
  const handle_submit = () => {
    navigate(-1);
  };

  return (
    <AppFrame
      title="Add New Address"
      navigation={<BackButton />}
      toolbar={<Button onClick={handle_submit}>Submit</Button>}
    >
      <Stack spacing={2}>
        <TextField label="Name" />
        <TextField label="Address" />
      </Stack>
    </AppFrame>
  );
};

export default AddAddress;
