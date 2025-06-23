import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { StateWallet, GlobalStateType } from '@minotaur-ergo/types';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Stack } from '@mui/material';

import { WalletDbAction } from '@/action/db';
import Confirm from '@/components/confirm/Confirm';
import Heading from '@/components/heading/Heading';
import { RouteMap, getRoute } from '@/router/routerMap';

import ActionButton from './ActionButton';

interface DangerousSettingsPropsType {
  wallet: StateWallet;
}

const DangerousSettings = (props: DangerousSettingsPropsType) => {
  const navigate = useNavigate();
  const pinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const [confirm, setConfirm] = useState(false);
  const deleteWallet = () => {
    WalletDbAction.getInstance()
      .deleteWallet(props.wallet.id, pinType)
      .then(() => {
        navigate(-navigate.length);
        navigate(getRoute(RouteMap.Wallets, {}), { replace: true });
      });
  };
  return (
    <Box mb={2}>
      <Heading title="Danger Zone" />
      <Stack spacing={2}>
        <ActionButton
          onClick={() => setConfirm(true)}
          label="Remove wallet"
          helperText="Some description about this option goes here."
          icon={<DeleteOutlineOutlinedIcon />}
        />
        <Confirm
          open={confirm}
          close={() => setConfirm(false)}
          confirmTitle={'Remove Wallet'}
          confirmDescription={'Are you sure you want to remove wallet?'}
          resolve={deleteWallet}
        />
      </Stack>
    </Box>
  );
};

export default DangerousSettings;
