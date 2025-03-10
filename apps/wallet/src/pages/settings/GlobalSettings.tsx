import ActionButton from '@/pages/settings/ActionButton';
import { getRoute, RouteMap } from '@/router/routerMap';
import React from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '@/components/heading/Heading';
import SolitarySelectField from '@/components/solitary/SolitarySelectField';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStateType } from '@/store';
import { DisplayType, setCurrency, setDisplay } from '@/store/reducer/config';
import { ConfigDbAction } from '@/action/db';
import { ConfigType } from '@/db/entities/Config';
import { useNavigate } from 'react-router-dom';

const GlobalSettings = () => {
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const currency = useSelector(
    (state: GlobalStateType) => state.config.currency,
  );
  const displayMode = useSelector(
    (state: GlobalStateType) => state.config.display,
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
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default GlobalSettings;
