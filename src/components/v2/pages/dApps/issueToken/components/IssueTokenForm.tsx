import React from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';

const IssueTokenForm = () => {
  return (
    <Stack spacing={2}>
      <TextField label="Token Name" />
      <TextField label="Token Description" />
      <TextField label="Amount" type="number" />
      <TextField label="Decimal" />
    </Stack>
  );
};

export default IssueTokenForm;
