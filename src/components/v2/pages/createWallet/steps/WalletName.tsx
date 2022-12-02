import React from 'react';
import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';

export default function WalletName() {
  return (
    <Box>
      <TextField label="Wallet name" />

      <Typography variant="subtitle2" sx={{ mt: 1, p: 1 }}>
        Network type
      </Typography>
      <ToggleButtonGroup value={'MAINNET'} color="primary">
        <ToggleButton value="MAINNET" aria-label="left aligned">
          MAINNET
        </ToggleButton>
        <ToggleButton value="TESTNET" aria-label="left aligned">
          TESTNET
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" sx={{ mt: 1, p: 1 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Typography>
    </Box>
  );
}
