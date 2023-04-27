import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import SolitaryTextField from '../../components/SolitaryTextField';
import SolitarySwitchField from '../../components/SolitarySwitchField';

const WalletSettings = () => {
  const [data, setData] = useState({
    name: 'My First Wallet',
    privacyMode: true,
  });
  return (
    <Box mb={2}>
      <Heading title="Wallet Settings" />
      <Stack spacing={2}>
        <SolitaryTextField
          label="Wallet name"
          value={data.name}
          onChange={(newValue) =>
            setData((prevState) => ({ ...prevState, name: newValue }))
          }
        />
        <SolitarySwitchField
          label="Privacy mode"
          value={data.privacyMode}
          onChange={(checked) =>
            setData((prevState) => ({ ...prevState, privacyMode: checked }))
          }
          helperText="Some description about this option goes here."
        />
      </Stack>
    </Box>
  );
};

export default WalletSettings;
