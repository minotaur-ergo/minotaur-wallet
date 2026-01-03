import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ConfigType, GlobalStateType } from '@minotaur-ergo/types';
import { getChain, MAIN_NET_LABEL, TEST_NET_LABEL } from '@minotaur-ergo/utils';
import { Box, Stack, Tab, Tabs } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import SolitarySelectField from '@/components/solitary/SolitarySelectField';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import AppFrame from '@/layouts/AppFrame';
import {
  setExplorerUrl,
  setNodeUrl,
  setSubmitTX,
  setSyncWithNode,
} from '@/store/reducer/config';

type NetworkType = 'MAINNET' | 'TESTNET';

const NetworkSettings = () => {
  const [tab, setTab] = useState<NetworkType>('MAINNET');
  const dispatch = useDispatch();
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const network = useSelector((state: GlobalStateType) => state.config.network);

  const saveSyncWithNode = (sync?: 'Node' | 'Explorer', url?: string) => {
    const isMainnet: boolean = tab === 'MAINNET';
    ConfigDbAction.getInstance()
      .setConfig(
        getConfigType(!!url),
        url ? url : sync === 'Node' ? 'Node' : 'Explorer',
        activePinType,
      )
      .then(() => {
        getChain(isMainnet ? MAIN_NET_LABEL : TEST_NET_LABEL).init(
          isMainnet
            ? network.mainnet.sync === 'Node'
            : network.testnet.sync === 'Node',
          isMainnet ? network.mainnet.explorerUrl : network.testnet.explorerUrl,
          isMainnet ? network.mainnet.nodeUrl : network.testnet.nodeUrl,
        );
        dispatch(
          url
            ? setNodeUrl({
                network: isMainnet ? 'MAINNET' : 'TESTNET',
                nodeUrl: url,
              })
            : setSyncWithNode({
                network: isMainnet ? 'MAINNET' : 'TESTNET',
                sync: sync || 'Explorer',
              }),
        );
      });
  };

  const saveExplorerUrl = (url: string) => {
    const isMainnet: boolean = tab === 'MAINNET';
    ConfigDbAction.getInstance()
      .setConfig(ConfigType.TestnetExplorerUrl, url, activePinType)
      .then(() => {
        getChain(isMainnet ? MAIN_NET_LABEL : TEST_NET_LABEL).init(
          isMainnet
            ? network.mainnet.sync === 'Node'
            : network.testnet.sync === 'Node',
          isMainnet ? network.mainnet.explorerUrl : network.testnet.explorerUrl,
          isMainnet ? network.mainnet.nodeUrl : network.testnet.nodeUrl,
        );
        dispatch(
          setExplorerUrl({
            network: isMainnet ? 'MAINNET' : 'TESTNET',
            explorerUrl: url,
          }),
        );
      });
  };

  const getConfigType = (isUrl: boolean): ConfigType => {
    const isMainnet: boolean = tab === 'MAINNET';
    return isUrl
      ? isMainnet
        ? ConfigType.MainnetNodeUrl
        : ConfigType.TestnetNodeUrl
      : isMainnet
        ? ConfigType.MainnetSync
        : ConfigType.TestnetSync;
  };

  const saveSubmitTX = (submit: 'Node' | 'Explorer') => {
    const isMainnet: boolean = tab === 'MAINNET';
    ConfigDbAction.getInstance()
      .setConfig(
        isMainnet ? ConfigType.MainnetSubmitTX : ConfigType.TestnetSubmitTX,
        submit,
        activePinType,
      )
      .then(() => {
        getChain(isMainnet ? MAIN_NET_LABEL : TEST_NET_LABEL).init(
          isMainnet
            ? network.mainnet.sync === 'Node'
            : network.testnet.sync === 'Node',
          isMainnet ? network.mainnet.explorerUrl : network.testnet.explorerUrl,
          isMainnet ? network.mainnet.nodeUrl : network.testnet.nodeUrl,
        );
        dispatch(
          setSubmitTX({
            network: isMainnet ? 'MAINNET' : 'TESTNET',
            submitTX: submit,
          }),
        );
      });
  };

  return (
    <AppFrame
      title={`${tab === 'MAINNET' ? 'Mainnet' : 'Testnet'} Network Settings`}
      navigation={<BackButtonRouter />}
    >
      <Box mx={2}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            'minHeight': 40,
            'mb': 2,
            'borderBottom': '1px solid',
            'borderColor': 'divider',
            '& .MuiTab-root': {
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 15,
              leadingTrim: 'NONE',
              lineHeight: '16px',
              letterSpacing: '0.16px',
            },
          }}
          TabIndicatorProps={{
            sx: {
              height: 2,
              borderRadius: 2,
              bottom: 0,
            },
          }}
        >
          <Tab tabIndex={0} value="MAINNET" label="Mainnet" />
          <Tab tabIndex={1} value="TESTNET" label="Testnet" />
        </Tabs>
        <Stack spacing={2}>
          <SolitaryTextField
            value={
              tab === 'MAINNET'
                ? network.mainnet.explorerUrl
                : network.testnet.explorerUrl
            }
            label={`Explorer URL`}
            onChange={(address) => {
              saveExplorerUrl(address);
            }}
          />
          <SolitaryTextField
            value={
              tab === 'MAINNET'
                ? network.mainnet.nodeUrl
                : network.testnet.nodeUrl
            }
            label={`Node URL`}
            onChange={(address) => {
              saveSyncWithNode(undefined, address);
            }}
          />
          <SolitarySelectField
            key={tab}
            label="Sync Source"
            value={
              tab === 'MAINNET' ? network.mainnet.sync : network.testnet.sync
            }
            options={[{ value: 'Explorer' }, { value: 'Node' }]}
            onChange={(network) => {
              saveSyncWithNode(network === 'Node' ? 'Node' : 'Explorer');
            }}
          />
          <SolitarySelectField
            key={`${tab}-tx`}
            label="Submit Transactions"
            value={
              tab === 'MAINNET'
                ? network.mainnet.submitTX
                : network.testnet.submitTX
            }
            options={[{ value: 'Explorer' }, { value: 'Node' }]}
            onChange={(network) => {
              saveSubmitTX(network === 'Node' ? 'Node' : 'Explorer');
            }}
          />
        </Stack>
      </Box>
    </AppFrame>
  );
};

export default NetworkSettings;
