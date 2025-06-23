import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import DisplayInHoneyMode from '@/pages/settings/DisplayInHoneyMode';
import { WALLET_FLAG_ENUM } from '@/utils/const';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Heading from '@/components/heading/Heading';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import { WalletDbAction } from '@/action/db';
import ActionButton from './ActionButton';
import { VisibilityOutlined } from '@mui/icons-material';
import { getRoute, RouteMap } from '@/router/routerMap';
import { StateWallet } from '@minotaur-ergo/types';
import { WalletType } from '@/db/entities/Wallet';

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
