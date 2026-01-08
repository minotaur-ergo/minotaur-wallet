import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  BackendUrlGenerator,
  ConfigType,
  EXPLORER_NETWORK,
  GlobalStateType,
  MAIN_NET_LABEL,
  NETWORK_BACKEND,
  NODE_NETWORK,
  TEST_NET_LABEL,
} from '@minotaur-ergo/types';
import { Box, Stack, Tab, Tabs } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import SolitarySelectField from '@/components/solitary/SolitarySelectField';
import SolitaryTextField from '@/components/solitary/SolitaryTextField';
import AppFrame from '@/layouts/AppFrame';
import { setBackend, setExplorerUrl, setNodeUrl } from '@/store/reducer/config';

const NetworkSettings = () => {
  const [tab, setTab] = useState<string>(MAIN_NET_LABEL);
  const backends = [EXPLORER_NETWORK, NODE_NETWORK];

  const dispatch = useDispatch();
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );

  const config = useSelector((state: GlobalStateType) => state.config.network);
  const network = useMemo(
    () => (tab === MAIN_NET_LABEL ? config.mainnet : config.testnet),
    [config, tab],
  );
  const setUrl = useCallback(
    async (backend: string, url: string) => {
      await ConfigDbAction.getInstance().setConfig(
        BackendUrlGenerator(tab, backend),
        url,
        activePinType,
      );
      const dispatchFn = backend === NODE_NETWORK ? setNodeUrl : setExplorerUrl;
      dispatch(dispatchFn({ network: tab, url }));
    },
    [activePinType, dispatch, tab],
  );

  const setDataBackend = useCallback(
    async (backend: string) => {
      await ConfigDbAction.getInstance().setConfig(
        tab === MAIN_NET_LABEL
          ? ConfigType.MainnetBackend
          : ConfigType.TestnetBackend,
        backend,
        activePinType,
      );
      const backendValue =
        backend === EXPLORER_NETWORK
          ? NETWORK_BACKEND.EXPLORER
          : NETWORK_BACKEND.NODE;
      dispatch(setBackend({ backend: backendValue, network: tab }));
    },
    [activePinType, dispatch, tab],
  );
  return (
    <AppFrame title={`Network Settings`} navigation={<BackButtonRouter />}>
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
          <Tab tabIndex={0} value={MAIN_NET_LABEL} label={MAIN_NET_LABEL} />
          <Tab tabIndex={1} value={TEST_NET_LABEL} label={TEST_NET_LABEL} />
        </Tabs>
        <Stack spacing={2}>
          {backends.map((item) => (
            <SolitaryTextField
              value={item === NODE_NETWORK ? network.node : network.explorer}
              label={`${item} URL`}
              onChange={(url) => setUrl(item, url)}
            />
          ))}
          <SolitarySelectField
            label="Type"
            value={network.backend}
            options={[{ value: EXPLORER_NETWORK }, { value: NODE_NETWORK }]}
            onChange={setDataBackend}
          />
        </Stack>
      </Box>
    </AppFrame>
  );
};

export default NetworkSettings;
