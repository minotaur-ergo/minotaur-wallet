import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ConfigType, GlobalStateType } from '@minotaur-ergo/types';
import { getChain, MAIN_NET_LABEL } from '@minotaur-ergo/utils';
import { Stack } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import AppFrame from '@/layouts/AppFrame';
import {
  setExplorerUrl,
  setNodeUrl,
  setSyncWithNode,
} from '@/store/reducer/config';

type NetworkType = 'MAINNET' | 'TESTNET';

const NetworkSettings = () => {
  const { network } = useParams<{ network: NetworkType }>();
  const dispatch = useDispatch();
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const { mainnetNetworkSetting, testnetNetworkSetting } = useSelector(
    (state: GlobalStateType) => state.config,
  );

  const saveSyncWithNode = (sync?: boolean, url?: string) => {
    ConfigDbAction.getInstance()
      .setConfig(
        getConfigType(!!url),
        url ? url : sync ? 'true' : 'false',
        activePinType,
      )
      .then(() => {
        getChain(MAIN_NET_LABEL).init(
          network === 'MAINNET'
            ? mainnetNetworkSetting.sync === 'node'
            : testnetNetworkSetting.sync === 'node',
          network === 'MAINNET'
            ? mainnetNetworkSetting.explorerUrl
            : testnetNetworkSetting.explorerUrl,
          network === 'MAINNET'
            ? mainnetNetworkSetting.nodeUrl
            : testnetNetworkSetting.nodeUrl,
        );
        dispatch(
          url
            ? setNodeUrl({ network: network || 'MAINNET', nodeUrl: url })
            : setSyncWithNode({
                network: network || 'MAINNET',
                syncWithNode: !!sync,
              }),
        );
      });
  };

  const saveExplorerUrl = (url: string) => {
    ConfigDbAction.getInstance()
      .setConfig(ConfigType.TestnetExplorerUrl, url, activePinType)
      .then(() => {
        getChain(MAIN_NET_LABEL).init(
          network === 'MAINNET'
            ? mainnetNetworkSetting.sync === 'node'
            : testnetNetworkSetting.sync === 'node',
          network === 'MAINNET'
            ? mainnetNetworkSetting.explorerUrl
            : testnetNetworkSetting.explorerUrl,
          network === 'MAINNET'
            ? mainnetNetworkSetting.nodeUrl
            : testnetNetworkSetting.nodeUrl,
        );
        dispatch(
          setExplorerUrl({
            network: network === 'MAINNET' ? 'MAINNET' : 'TESTNET',
            explorerUrl: url,
          }),
        );
      });
  };

  const getConfigType = (isAddress: boolean): ConfigType => {
    return isAddress
      ? network === 'MAINNET'
        ? ConfigType.MainnetNodeAddress
        : ConfigType.TestnetNodeAddress
      : network === 'MAINNET'
        ? ConfigType.MainnetSyncWithNode
        : ConfigType.TestnetSyncWithNode;
  };

  return (
    <AppFrame
      title={`${network === 'MAINNET' ? 'Mainnet' : 'Testnet'} Network Settings`}
      navigation={<BackButtonRouter />}
    >
      <Stack spacing={2}>
        <SolitaryTextField
          value={
            network === 'MAINNET'
              ? mainnetNetworkSetting.explorerUrl
              : testnetNetworkSetting.explorerUrl
          }
          label={`${network === 'MAINNET' ? 'Mainnet' : 'Testnet'} Explorer API URL`}
          onChange={(address) => {
            saveExplorerUrl(address);
          }}
        />
        <SolitaryTextField
          value={
            network === 'MAINNET'
              ? mainnetNetworkSetting.nodeUrl
              : testnetNetworkSetting.nodeUrl
          }
          label={`${network === 'MAINNET' ? 'Mainnet' : 'Testnet'} Node URL`}
          onChange={(address) => {
            saveSyncWithNode(undefined, address);
          }}
        />
        <SolitarySwitchField
          label="Sync Using Node"
          checkedDescription="Yes"
          uncheckedDescription="No"
          value={
            network === 'MAINNET'
              ? mainnetNetworkSetting.sync === 'node'
              : testnetNetworkSetting.sync === 'node'
          }
          onChange={(sync) => {
            saveSyncWithNode(sync);
          }}
        />
      </Stack>
    </AppFrame>
  );
};

export default NetworkSettings;
