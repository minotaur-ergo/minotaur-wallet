import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import SolitaryTextField from '../../components/SolitaryTextField';
import SolitarySwitchField from '../../components/SolitarySwitchField';
import ActionButton from './ActionButton';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

const WalletSettings = () => {
  const navigate = useNavigate();
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
        <ActionButton
          label="Change password"
          helperText="Some description about this option goes here."
          onClick={() => navigate(RouterMap.ChangePassword)}
        />
        <ActionButton
          label="Export wallet"
          helperText="Some description about this option goes here."
          icon={<IosShareOutlinedIcon />}
        />
      </Stack>
    </Box>
  );
};

export default WalletSettings;
