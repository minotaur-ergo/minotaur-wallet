import React, { useEffect, useState } from 'react';
import { Container, Grid, Button } from '@mui/material';
import MnemonicView from '../elements/MnemonicView';
import MnemonicPassword from '../elements/MnemonicPassword';
import * as bip39 from 'bip39';
import InAdvancedMode from '../../../display-view/InAdvancedMode';
import MnemonicWordLength from './MnemonicWordLength';

interface PropsType {
  mnemonic?: string;
  mnemonic_passphrase: string;
  goBack: () => any;
  goForward: (mnemonic: string, mnemonic_passphrase: string) => any;
}

const Mnemonic = (props: PropsType) => {
  // const initialMnemonic = props.mnemonic ? props.mnemonic : 'cereal gown current ordinary coast lake poem junk acquire parrot anxiety husband depth bulb wolf';//bip39.generateMnemonic();
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
          <h2 style={{ margin: 0 }}>Create Wallet</h2>
        </Grid>
        <Grid item xs={12}>
          <p>
            this is your mnemonic for your ergo wallet. with these words you can
            restore your wallet on any other device. write words on a paper and
            store it in a safe and secure place
          </p>
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
            <p style={{ color: 'red' }}>
              Be careful if you lose your password you will not be able to
              recover the ergs in your wallet
            </p>
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
            Yes. I've write it down
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Mnemonic;
