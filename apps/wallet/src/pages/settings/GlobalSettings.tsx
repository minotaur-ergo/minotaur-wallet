import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { DisplayType, GlobalStateType } from '@minotaur-ergo/types';
import { Box, Stack } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import Heading from '@/components/heading/Heading';
import SolitarySelectField from '@/components/solitary/SolitarySelectField';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import { ConfigType } from '@/db/entities/Config';
import ActionButton from '@/pages/settings/ActionButton';
import { RouteMap, getRoute } from '@/router/routerMap';
import {
  setActiveWallet,
  setCurrency,
  setDisplay,
} from '@/store/reducer/config';

const GlobalSettings = () => {
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const displayMode = useSelector(
    (state: GlobalStateType) => state.config.display,
  );
  const { useActiveWallet, activeWallet, currency } = useSelector(
    (state: GlobalStateType) => state.config,
  );
  const dispatch = useDispatch();
  const saveCurrency = (currency: string) => {
    ConfigDbAction.getInstance()
      .setConfig(ConfigType.Currency, currency, activePinType)
      .then(() => {
        dispatch(setCurrency({ currency }));
      });
  };
  const saveDisplayMode = (displayMode: string) => {
    ConfigDbAction.getInstance()
      .setConfig(ConfigType.DisplayMode, displayMode, activePinType)
      .then(() => {
        dispatch(setDisplay({ display: displayMode as DisplayType }));
      });
  };
  const saveUseActiveWallet = (useActiveWallet: boolean) => {
    ConfigDbAction.getInstance()
      .setConfig(
        ConfigType.useActiveWallet,
        useActiveWallet ? 'true' : 'false',
        activePinType,
      )
      .then(() => {
        dispatch(
          setActiveWallet({
            useActiveWallet,
            activeWallet: activeWallet ?? -1,
          }),
        );
      });
  };
  const navigate = useNavigate();
  const hasPin = useSelector(
    (state: GlobalStateType) => state.config.pin.hasPin,
  );

  return (
    <React.Fragment>
      <Box mb={2}>
        <Heading title="Global Settings" />
        <Stack spacing={2}>
          <SolitarySelectField
            label="Currency conversion"
            value={currency}
            options={[{ value: 'USD' }]}
            onChange={saveCurrency}
          />
          <SolitarySelectField
            label="Display Mode"
            value={displayMode}
            options={[{ value: 'simple' }, { value: 'advanced' }]}
            onChange={saveDisplayMode}
          />
          <ActionButton
            label="Wallet Pin"
            helperText="Set or change wallet pin. This pin used to protect wallet usage only."
            onClick={() => navigate(getRoute(RouteMap.Pin, {}))}
          />
          {hasPin ? (
            <ActionButton
              label="Honey Pin"
              helperText="Use Honey Pin to enter honey mode. in honey mode you can only view some selected wallets"
              onClick={() => navigate(getRoute(RouteMap.HoneyPin, {}))}
            />
          ) : undefined}
          <SolitarySwitchField
            label="Display last active wallet on load"
            checkedDescription="Yes"
            uncheckedDescription="No"
            value={useActiveWallet}
            onChange={saveUseActiveWallet}
          />
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default GlobalSettings;
