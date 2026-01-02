import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ConfigType, DisplayType, GlobalStateType } from '@minotaur-ergo/types';
import { getCurrencySymbol } from '@minotaur-ergo/utils/src/currency';
import { Box, Stack } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import Heading from '@/components/heading/Heading';
import SolitarySelectField, {
  OptionsType,
} from '@/components/solitary/SolitarySelectField';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import getCurrencies from '@/hooks/useCurrencies';
import ActionButton from '@/pages/settings/ActionButton';
import { getRoute, RouteMap } from '@/router/routerMap';
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
    currency = currency.split(' ')[0];
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

  const [currencies, setCurrencies] = useState<OptionsType[]>([
    { value: `${currency} (${getCurrencySymbol(currency).symbol})` },
  ]);

  return (
    <React.Fragment>
      <Box mb={2}>
        <Heading title="Global Settings" />
        <Stack spacing={2}>
          <SolitarySelectField
            label="Currency conversion"
            showSearch={true}
            value={`${currency} (${getCurrencySymbol(currency).symbol})`}
            options={currencies}
            onChange={saveCurrency}
            onOpen={() => {
              getCurrencies().then((data) => {
                setCurrencies(data);
              });
            }}
          />
          <SolitarySelectField
            label="Display Mode"
            value={displayMode}
            options={[{ value: 'simple' }, { value: 'advanced' }]}
            onChange={saveDisplayMode}
          />
          <ActionButton
            label="Wallet PIN"
            helperText="Set or change wallet PIN. This PIN is used to protect wallet usage only."
            onClick={() => navigate(getRoute(RouteMap.Pin, {}))}
          />
          {hasPin ? (
            <ActionButton
              label="Honey PIN"
              helperText="Use Honey PIN to enter honey mode. In honey mode you can only view some selected wallets."
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
          <ActionButton
            label="Network Settings"
            helperText="Choose how the wallet connects to the Mainnet and Testnet networks."
            onClick={() => navigate(getRoute(RouteMap.NetworkSettings, {}))}
          />
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default GlobalSettings;
