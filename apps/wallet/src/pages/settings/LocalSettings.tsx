import { useNavigate } from 'react-router-dom';

import { StateWallet, WalletType } from '@minotaur-ergo/types';
import { WALLET_FLAG_ENUM } from '@minotaur-ergo/utils';
import { VisibilityOutlined } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';

import { WalletDbAction } from '@/action/db';
import Heading from '@/components/heading/Heading';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import DisplayInHoneyMode from '@/pages/settings/DisplayInHoneyMode';
import { getRoute, RouteMap } from '@/router/routerMap';

import ActionButton from './ActionButton';

interface LocalSettingsPropsType {
  wallet: StateWallet;
}

const LocalSettings = (props: LocalSettingsPropsType) => {
  const navigate = useNavigate();
  const setName = (newName: string) => {
    WalletDbAction.getInstance()
      .setWalletName(props.wallet.id, newName)
      .then(() => null);
  };
  const setArchived = (archived: boolean) => {
    WalletDbAction.getInstance()
      .setFlagOnWallet(props.wallet.id, WALLET_FLAG_ENUM.ARCHIVE, !archived)
      .then(() => null);
  };
  return (
    <Box mb={2}>
      <Heading title="Wallet Settings" />
      <Stack spacing={2}>
        <SolitaryTextField
          label="Wallet name"
          value={props.wallet.name}
          onChange={(newValue) => setName(newValue)}
        />
        {props.wallet.type === WalletType.Normal ? (
          <ActionButton
            label="Change Password"
            helperText="Change Wallet Encryption Password"
            onClick={() =>
              navigate(
                getRoute(RouteMap.WalletChangePassword, {
                  id: props.wallet.id,
                }),
              )
            }
          />
        ) : null}
        {props.wallet.xPub && props.wallet.type !== WalletType.MultiSig ? (
          <ActionButton
            label="Extended public key"
            helperText="Display extended public key for read-only wallet."
            icon={<VisibilityOutlined />}
            onClick={() =>
              navigate(getRoute(RouteMap.WalletXPub, { id: props.wallet.id }))
            }
          />
        ) : null}
        {/*<SolitarySwitchField*/}
        {/*    label="Privacy mode"*/}
        {/*    value={data.privacyMode}*/}
        {/*    onChange={(checked) =>*/}
        {/*        setData((prevState) => ({ ...prevState, privacyMode: checked }))*/}
        {/*    }*/}
        {/*    helperText="Some description about this option goes here."*/}
        {/*/>*/}
        {/*<ActionButton*/}
        {/*    label="Export wallet"*/}
        {/*    helperText="Some description about this option goes here."*/}
        {/*    icon={<IosShareOutlinedIcon />}*/}
        {/*/>*/}
        <SolitarySwitchField
          label="Archive wallet"
          checkedDescription="Archived"
          uncheckedDescription="No"
          value={props.wallet.archived}
          onChange={setArchived}
        />
        <DisplayInHoneyMode wallet={props.wallet} />
      </Stack>
    </Box>
  );
};

export default LocalSettings;
