import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Alert } from '@mui/material';
import MnemonicView from '../elements/MnemonicView';
import MnemonicPassword from '../elements/MnemonicPassword';
import * as bip39 from 'bip39';
import InAdvancedMode from '../../../display-view/InAdvancedMode';
import MnemonicWordLength from './MnemonicWordLength';

interface PropsType {
  mnemonic?: string;
  mnemonic_passphrase: string;
  goBack: () => unknown;
  goForward: (mnemonic: string, mnemonic_passphrase: string) => unknown;
}

const Mnemonic = (props: PropsType) => {
  const initialMnemonic = props.mnemonic
    ? props.mnemonic
    : bip39.generateMnemonic(160);
  const [mnemonic, setMnemonic] = useState(initialMnemonic);
  const initialWordSize = mnemonic ? mnemonic.split(' ').length : 15;
  const [mnemonicWordSize, setMnemonicWordSize] = useState(initialWordSize);
  const [mnemonic_passphrase, set_mnemonic_passphrase] = useState<{
    password: string;
    valid: boolean;
  }>({
    password: props.mnemonic_passphrase,
    valid: true,
  });
  useEffect(() => {
    if (mnemonic.split(' ').length !== mnemonicWordSize) {
      setMnemonic(bip39.generateMnemonic((mnemonicWordSize / 3) * 32));
    }
  }, [mnemonic, mnemonicWordSize]);
  const setMnemonicWordCount = (words: number) => {
    if (words !== mnemonicWordSize) {
      setMnemonicWordSize(words);
    }
  };
  return (
    <Container>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12}>
          <h2 style={{ margin: 0 }}>Wallet Mnemonic</h2>
        </Grid>
        <Grid item xs={12}>
          <p>
            Please save these words on paper (order is important). This mnemonic
            is the only way to recover your wallet.
          </p>
          <Alert severity={'warning'}>
            WARNING:
            <br />
            Never disclose your mnemonic.
            <br />
            Never type it on a website.
            <br />
            Do not store it electronically.
            <br />
          </Alert>
        </Grid>
        <InAdvancedMode>
          <Grid item xs={12}>
            <MnemonicWordLength
              value={mnemonicWordSize}
              setValue={setMnemonicWordCount}
            />
          </Grid>
        </InAdvancedMode>
        <MnemonicView mnemonic={mnemonic} />
        <InAdvancedMode>
          <Grid item xs={12}>
            <MnemonicPassword
              confirm={true}
              password={mnemonic_passphrase.password}
              valid={mnemonic_passphrase.valid}
              setPassword={(password: string, valid: boolean) =>
                set_mnemonic_passphrase({
                  password,
                  valid,
                })
              }
            />
          </Grid>
        </InAdvancedMode>
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
            disabled={!mnemonic_passphrase.valid}
            onClick={() =>
              props.goForward(mnemonic, mnemonic_passphrase.password)
            }
          >
            I've write it down
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Mnemonic;
