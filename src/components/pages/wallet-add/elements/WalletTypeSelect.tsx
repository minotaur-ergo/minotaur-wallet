import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake, faWallet } from '@fortawesome/free-solid-svg-icons';
import {
  Grid,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { WalletType } from '../../../../db/entities/Wallet';

interface PropsType {
  value: string | React.ReactElement;
  setValue: (type: WalletType) => unknown;
}

const WalletTypeSelect = (props: PropsType) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ToggleButtonGroup
          color="primary"
          size="medium"
          style={{ width: '100%' }}
          value={props.value}
          exclusive
          onChange={(event, newType) => props.setValue(newType)}
        >
          <ToggleButton style={{ width: '50%' }} value={WalletType.Cold}>
            <FontAwesomeIcon icon={faSnowflake} />
            &nbsp;Cold
          </ToggleButton>
          <ToggleButton style={{ width: '50%' }} value={WalletType.Normal}>
            <FontAwesomeIcon icon={faWallet} />
            &nbsp;Normal
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography style={{ color: '#777' }}>
          Cool wallet is designed for more security. It is usually created on a
          device that is not connected to the Internet. Next to it, a read-only
          wallet is created on an internet-connected device. You create your
          transactions using a read-only wallet and then sign it using a cold
          wallet. Note that if this wallet is connected to the Internet, the
          boxes will not be updated for it.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WalletTypeSelect;
