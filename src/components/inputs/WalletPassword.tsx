import { Button, Container, Grid } from '@mui/material';
import PasswordInput from './PasswordInput';
import React from 'react';
import Wallet from '../../db/entities/Wallet';
import Address from '../../db/entities/Address';
import AddressWithErg from '../../db/entities/views/AddressWithErg';
import { AddressAction } from '../../action/action';
// import { validatePassword } from "../action/address";

interface PropsType {
  password: string;
  setPassword: (password: string) => unknown;
  complete: () => unknown;
  size?: 'small' | 'medium';
  wallet?: Wallet;
  address?: Address | AddressWithErg;
}

const WalletPassword = (props: PropsType) => {
  const passwordValid = props.wallet
    ? AddressAction.validatePassword(props.wallet, props.password)
    : false;
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <br />
          Please enter your wallet's password
        </Grid>
        <Grid item xs={12}>
          <PasswordInput
            size={props.size}
            label="Wallet Password"
            error=""
            password={props.password}
            setPassword={props.setPassword}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={!passwordValid}
            variant="contained"
            fullWidth
            color="primary"
            onClick={props.complete}
          >
            Sign
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WalletPassword;
