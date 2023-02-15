import React from 'react';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { NETWORK_TYPES } from '../../../../util/network_type';

interface PropType {
  network: string;
  setNetworkType: (network: string) => unknown;
}

const WalletNetworkSelect = (props: PropType) => {
  if (NETWORK_TYPES.length <= 1) return null;
  const width = 100 / NETWORK_TYPES.length;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        Network Type
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          color="primary"
          size="medium"
          style={{ width: '100%' }}
          value={props.network}
          exclusive
          onChange={(event, newType) => {
            if (newType != null) props.setNetworkType(newType);
          }}
        >
          {NETWORK_TYPES.map((item, index) => (
            <ToggleButton
              key={index}
              style={{ width: `${width}%` }}
              value={item.label}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default WalletNetworkSelect;
