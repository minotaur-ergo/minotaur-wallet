import { GlobalStateType } from '@/store';
import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import ActionButton from './ActionButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Heading from '@/components/heading/Heading';
import { WalletDbAction } from '@/action/db';
import { useNavigate } from 'react-router-dom';
import { getRoute, RouteMap } from '@/router/routerMap';
import Confirm from '@/components/confirm/Confirm';
import { StateWallet } from '@/store/reducer/wallet';

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
