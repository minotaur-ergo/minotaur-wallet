import React, { useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { AddressAction } from '../../../../action/action';
import { getNetworkType } from '../../../../util/network_type';
import CopyableAddress from '../../../copyable-address/CopyableAddress';

interface AddressConfirmPropsType {
  mnemonic: string;
  password: string;
  network_type: string;
  goBack: () => unknown;
  goForward: () => unknown;
}

const AddressConfirm = (props: AddressConfirmPropsType) => {
  const [address, setAddress] = useState<string>();
  const network_type = getNetworkType(props.network_type);
  AddressAction.deriveAddressFromMnemonic(
    props.mnemonic,
    props.password,
    network_type.prefix,
    0
  ).then((derivedAddress) => setAddress(derivedAddress.address));
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} marginBottom={2}>
          <Typography>This is your main address.</Typography>
          <Typography>
            Please check it. if this is not your address you entered mnemonic or
            mnemonic passphrase wrong. double check it and try again
          </Typography>
          <div>
            <CopyableAddress address={address} />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Button variant="contained" color="primary" onClick={props.goBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={props.goForward}>
            OK
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddressConfirm;
