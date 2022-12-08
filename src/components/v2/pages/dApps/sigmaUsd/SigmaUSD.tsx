import React from 'react';
import { Button, TextField } from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';

const SigmaUSD = () => {
  return (
    <AppFrame title="SigmaUSD" navigation={<BackButton />}>
      <TextField label="Amount" />
      <Button>Purchase</Button>
    </AppFrame>
  );
};

export default SigmaUSD;
