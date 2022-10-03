import React, { useState } from 'react';
import { Button, Container, Grid } from '@mui/material';
import TextInput from '../../../inputs/TextInput';

interface WalletNamePropsType {
  name: string;
  goBack?: () => any;
  goForward: (name: string) => any;
  children?: React.ReactNode;
}

const WalletName = (props: WalletNamePropsType) => {
  const [name, setName] = useState(props.name);

  const validateName = () => {
    return name === '' ? 'Name must entered' : '';
  };
  const formValid = () => {
    return validateName() === '';
  };

  return (
    <Container>
      <Grid container columnSpacing={2} marginBottom={2}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
        <Grid item xs={12}>
          <TextInput
            label="Wallet name"
            error={validateName()}
            value={name}
            setValue={setName}
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
            onClick={() => props.goForward(name)}
            disabled={!formValid()}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WalletName;
