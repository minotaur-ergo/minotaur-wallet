import React from 'react';
import { Box, FormHelperText, Stack, Typography } from '@mui/material';
import PasswordField from '../../../components/PasswordField';

interface TokenItemPropsType {
  amount: number;
  name: string;
  color?: 'primary' | 'success' | 'error';
}

function TokenItem({ amount, name, color }: TokenItemPropsType) {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 6,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor:
            color === 'success'
              ? 'success.light'
              : color === 'error'
              ? 'error.light'
              : 'primary.light',
        }}
      />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {name}
      </Typography>
      <Typography variant="body2">{amount.toFixed(2)}</Typography>
    </Box>
  );
}

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

      <Typography variant="body2" color="textSecondary">
        Burning tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem name="Token 1" amount={10} color="error" />
        <TokenItem name="Token 2" amount={5} color="error" />
      </Stack>
      <Typography variant="body2" color="textSecondary">
        Issuing tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem name="Token 1" amount={3} color="success" />
        <TokenItem name="Token 2" amount={24} color="success" />
      </Stack>

      <PasswordField
        label="Wallet Password"
        helperText="Enter your mnemonic passphrase to send transaction."
      />
    </Box>
  );
}
