import React, { useEffect } from 'react';

import { MAIN_NET_LABEL, TEST_NET_LABEL } from '@minotaur-ergo/types';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

interface WalletNamePropsType {
  name: string;
  setHasError: (hasError: boolean) => unknown;
  network: string;
  setName: (newValue: string) => unknown;
  setNetwork: (newValue: string) => unknown;
  children?: React.ReactNode;
}

const WalletName = (props: WalletNamePropsType) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue !== null) {
      props.setNetwork(newValue);
    }
  };
  const handleSetName = (value: string) => {
    props.setName(value);
  };
  useEffect(() => {
    props.setHasError(props.name === '');
  });
  return (
    <Box>
      {props.children}
      <TextField
        label="Wallet name"
        value={props.name}
        onChange={({ target }) => handleSetName(target.value)}
      />

      <Typography variant="subtitle2" sx={{ mt: 1, p: 1 }}>
        Network type
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={props.network}
        color="primary"
        onChange={handleChange}
      >
        <ToggleButton value={MAIN_NET_LABEL} aria-label="left aligned">
          MAIN-NET
        </ToggleButton>
        <ToggleButton value={TEST_NET_LABEL} aria-label="left aligned">
          TEST-NET
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default WalletName;
