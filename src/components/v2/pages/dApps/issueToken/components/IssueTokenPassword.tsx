import React from 'react';
import { Box, Typography } from '@mui/material';
import PasswordField from '../../../../components/PasswordField';

const IssueTokenPassword = () => {
  return (
    <Box>
      <Typography sx={{ mb: 2 }}>
        Please enter your mnemonic passphrase to send transaction.
      </Typography>
      <PasswordField label="Wallet Password" />
    </Box>
  );
};

export default IssueTokenPassword;
