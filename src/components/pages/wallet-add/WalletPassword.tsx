import React, { useState } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { PASSWORD_LENGTH } from '../../../util/const';
import PasswordInput from '../../inputs/PasswordInput';
import ReactLoading from 'react-loading';

interface PropsType {
  password?: string;
  saving: boolean;
  goBack?: () => unknown;
  goForward: (password: string) => unknown;
}

const WalletPassword = (props: PropsType) => {
  const [password, setPassword] = useState(
    props.password ? props.password : ''
  );
  const [confirmPassword, setConfirmPassword] = useState(
    props.password ? props.password : ''
  );
  const passwordError = () => {
    if (password === '') return 'Password is required';
    if (password.length < PASSWORD_LENGTH)
      return `Password length must be at least ${PASSWORD_LENGTH} characters`;
    return '';
  };
  const passwordConfirmError = () => {
    return password !== confirmPassword ? 'Password are not same' : '';
  };
  const formValid = () => {
    return passwordError() + passwordConfirmError() === '';
  };
  return (
    <Container>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12}>
          <br />
          Choose a strong password to encrypt your wallet keys. If you forget
          this password, the only way to access your funds is recovering the
          wallet using the mnemonic.{' '}
        </Grid>
        <Grid item xs={12}>
          <PasswordInput
            label="Password"
            error={passwordError()}
            password={password}
            setPassword={setPassword}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordInput
            error={passwordConfirmError()}
            password={confirmPassword}
            setPassword={setConfirmPassword}
            label="Confirm Password"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Button variant="contained" color="primary" onClick={props.goBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.goForward(password)}
            disabled={!formValid() || props.saving}
          >
            {props.saving ? (
              <ReactLoading
                type="spin"
                color="#000"
                width="20px"
                height="20px"
              />
            ) : (
              'Save'
            )}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WalletPassword;
