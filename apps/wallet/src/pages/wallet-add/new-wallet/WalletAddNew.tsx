import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import * as bip39 from 'bip39';
import { createWallet } from '@/action/wallet';
import AppFrame from '@/layouts/AppFrame';
import Stepper from '@/components/stepper/Stepper';
import WalletName from '../components/wallet-name/WalletName';
import WalletMnemonic from '../components/wallet-mnemonic/WalletMnemonic';
import ConfirmMnemonic from '../components/mnemonic-confirm/ConfirmMnemonic';
import WalletPassword from '../components/wallet-password/WalletPassword';
import CircularProgress from '@mui/material/CircularProgress';
import { WalletType } from '@/db/entities/Wallet';
import MessageContext from '@/components/app/messageContext';
import { MAIN_NET_LABEL } from '@/utils/const';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

type WalletValueKeys =
  | 'name'
  | 'network'
  | 'mnemonic'
  | 'mnemonicPassphrase'
  | 'password';

const WalletAddNew = () => {
  const context = useContext(MessageContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasError, setHasError] = useState(true);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState({
    name: '',
    network: MAIN_NET_LABEL,
    mnemonic: bip39.generateMnemonic(160),
    mnemonicPassphrase: '',
    password: '',
  });
  const MNEMONIC_STEP_NUM = 2;
  const STEPS_COUNTS = 4;
  const setMnemonicSize = (size: number) => {
    setParam('mnemonic', bip39.generateMnemonic((size / 3) * 32));
  };
  console.log(values);
  const handleBack = () => {
    if (step > 1) setStep((prevState) => prevState - 1);
    else navigate(-1);
  };

  const handleNext = () => {
    if (step < STEPS_COUNTS) setStep((prevState) => prevState + 1);
    else create();
  };

  const setParam = (paramName: WalletValueKeys, paramValue: string) => {
    if ((values[paramName] as string) !== paramValue) {
      setValues({ ...values, [paramName]: paramValue });
    }
  };

  const create = () => {
    if (!creating) {
      setCreating(true);
      createWallet(
        values.name,
        WalletType.Normal,
        values.mnemonic,
        values.mnemonicPassphrase,
        values.network,
        values.password,
      )
        .then(() => {
          navigate(-2);
        })
        .catch((exp) => {
          context.insert(exp, 'error');
        });
    }
  };

  return (
    <AppFrame
      title="Create New Wallet"
      navigation={<BackButtonRouter />}
      toolbar={
        <React.Fragment>
          <Grid container spacing={2}>
            {step === 1 ? null : (
              <Grid item xs={6}>
                <Button onClick={handleBack}>Back</Button>
              </Grid>
            )}
            <Grid item xs={step === 1 ? 12 : 6}>
              <Button onClick={handleNext} disabled={hasError}>
                {step === STEPS_COUNTS ? (
                  <React.Fragment>
                    {creating ? (
                      <CircularProgress size={20} className="color-white" />
                    ) : null}
                    &nbsp;Create
                  </React.Fragment>
                ) : step === MNEMONIC_STEP_NUM ? (
                  "I've written it down"
                ) : (
                  'Next'
                )}
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      }
    >
      <Stepper activeStep={step}>
        <WalletName
          setHasError={setHasError}
          name={values.name}
          setName={(name) => setParam('name', name)}
          network={values.network}
          setNetwork={(network) => setParam('network', network)}
        />
        <WalletMnemonic
          setHasError={setHasError}
          mnemonic={values.mnemonic}
          mnemonicPassphrase={values.mnemonicPassphrase}
          newMnemonic={setMnemonicSize}
          setMnemonicPassphrase={(mnemonicPassphrase) =>
            setParam('mnemonicPassphrase', mnemonicPassphrase)
          }
        />
        <ConfirmMnemonic mnemonic={values.mnemonic} setHasError={setHasError} />
        <WalletPassword
          password={values.password}
          setPassword={(password) => setParam('password', password)}
          setHasError={setHasError}
        />
      </Stepper>
    </AppFrame>
  );
};

export default WalletAddNew;
