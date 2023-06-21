import React from 'react';
import { Box, FormHelperText, Typography } from '@mui/material';
import PasswordField from '../../../components/PasswordField';

export default function () {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        Total spent
      </Typography>
      <Typography fontSize="large">
        {(3.0011).toFixed(2)}{' '}
        <Typography component="span" variant="body2" color="textSecondary">
          ERG
        </Typography>
      </Typography>
      <FormHelperText sx={{ mb: 2 }}>
        These amount will be spent when transaction proceed.
      </FormHelperText>

      <PasswordField
        label="Wallet Password"
        helperText="Enter your mnemonic passphrase to send transaction."
      />
    </Box>
  );
}
