import { useDispatch, useSelector } from 'react-redux';

import { ConfigType, GlobalStateType } from '@minotaur-ergo/types';
import { Stack } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import AppFrame from '@/layouts/AppFrame';
import {
  setMainnetNodeAddress,
  setMainnetSyncWithNode,
} from '@/store/reducer/config';
import { DEFAULT_NODE_ADDRESS } from '@/utils/const';

const MainnetNetworkSettings = () => {
  const dispatch = useDispatch();
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const { mainnetNodeAddress, mainnetSyncWithNode } = useSelector(
    (state: GlobalStateType) => state.config,
  );

  const saveSyncWithNode = (sync?: boolean, address?: string) => {
    //   const NODE_ADDRESS_REGEX =
    // /^((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((\d{1,3}\.){3}\d{1,3})|(\[[0-9a-fA-F:]+\])):\d{1,5}$/;

    ConfigDbAction.getInstance()
      .setConfig(
        getConfigType(!!address),
        address ? address : sync ? 'true' : 'false',
        activePinType,
      )
      .then(() => {
        dispatch(
          address
            ? setMainnetNodeAddress(address)
            : setMainnetSyncWithNode(!!sync),
        );
      });
  };

  const getConfigType = (isAddress: boolean): ConfigType => {
    return isAddress
      ? ConfigType.MainnetNodeAddress
      : ConfigType.MainnetSyncWithNode;
  };

  return (
    <AppFrame
      title={'Mainnet Network Settings'}
      navigation={<BackButtonRouter />}
    >
      <Stack spacing={2}>
        <SolitarySwitchField
          label="Use Node Explorer API For Mainnet"
          checkedDescription="Yes"
          uncheckedDescription="No"
          value={mainnetSyncWithNode}
          onChange={(sync) => {
            saveSyncWithNode(sync);
          }}
        />
        {mainnetSyncWithNode && (
          <SolitaryTextField
            value={mainnetNodeAddress}
            label="Node URL"
            onChange={(address) => {
              saveSyncWithNode(undefined, address);
            }}
            resetLabel="Reset"
            resetValue={DEFAULT_NODE_ADDRESS}
          />
        )}
      </Stack>
    </AppFrame>
  );
};

export default MainnetNetworkSettings;
