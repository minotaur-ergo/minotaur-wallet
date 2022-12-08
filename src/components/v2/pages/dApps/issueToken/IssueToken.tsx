import React from 'react';
import { Button, TextField } from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';

const IssueToken = () => {
  return (
    <AppFrame
      title="Issue Token"
      navigation={<BackButton />}
      toolbar={<Button>Next</Button>}
    >
      <TextField label="Token Name" />
      <TextField label="Token Description" />
      <TextField label="Amount" />
      <TextField label="Decimal" />
    </AppFrame>
  );
};

export default IssueToken;
