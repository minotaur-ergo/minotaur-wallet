import React from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '@/components/heading/Heading';
import SolitarySelectField from '@/components/solitary/SolitarySelectField';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStateType } from '@/store';
import { DisplayType, setCurrency, setDisplay } from '@/store/reducer/config';
import { ConfigDbAction } from '@/action/db';
import { ConfigType } from '@/db/entities/Config';

const GlobalSettings = () => {
  const currency = useSelector(
    (state: GlobalStateType) => state.config.currency,
  );
  const displayMode = useSelector(
    (state: GlobalStateType) => state.config.display,
  );
  const dispatch = useDispatch();
  const saveCurrency = (currency: string) => {
    ConfigDbAction.getInstance().setConfig(ConfigType.Currency, currency);
    dispatch(setCurrency({ currency }));
  };
  const saveDisplayMode = (displayMode: string) => {
    ConfigDbAction.getInstance().setConfig(ConfigType.DisplayMode, displayMode);
    dispatch(setDisplay({ display: displayMode as DisplayType }));
  };
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
        </Stack>
      </Box>
      <Box>
        <Stack spacing={2}>
          <SolitarySelectField
            label="Display Mode"
            value={displayMode}
            options={[{ value: 'simple' }, { value: 'advanced' }]}
            onChange={saveDisplayMode}
          />
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default GlobalSettings;
