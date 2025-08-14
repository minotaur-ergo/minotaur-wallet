import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WalletType } from '@minotaur-ergo/types';
import { MAIN_NET_LABEL } from '@minotaur-ergo/utils';
import { Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { createWallet } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import Stepper from '@/components/stepper/Stepper';
import AppFrame from '@/layouts/AppFrame';

import AddressConfirm from '../components/address-confirm/AddressConfirm';
import { MnemonicRestore } from '../components/mnemonic-restore/MnemonicRestore';
import WalletName from '../components/wallet-name/WalletName';
import WalletPassword from '../components/wallet-password/WalletPassword';

type WalletValueKeys =
  | 'name'
  | 'network'
  | 'mnemonic'
  | 'mnemonicPassphrase'
  | 'password';

const WalletRestore = () => {
  const context = useContext(MessageContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasError, setHasError] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [values, setValues] = useState({
    name: '',
    network: MAIN_NET_LABEL,
    mnemonic: '',
    mnemonicPassphrase: '',
    password: '',
    readOnlyWalletId: -1,
  });
  const STEPS_COUNTS = 4;

  const restore = () => {
    if (!restoring) {
      setRestoring(true);
      createWallet(
        values.name,
        WalletType.Normal,
        values.mnemonic,
        values.mnemonicPassphrase,
        values.network,
        values.password,
        values.readOnlyWalletId === -1 ? undefined : values.readOnlyWalletId,
      )
        .then(() => {
          navigate(-2);
        })
        .catch((exp) => {
          context.insert(exp, 'error');
        });
    }
  };

  const handleNext = () => {
    if (step < STEPS_COUNTS) setStep((prevState) => prevState + 1);
    else restore();
  };

  const handleBack = () => {
    if (step > 1) setStep((prevState) => prevState - 1);
    else navigate(-1);
  };

  const setParam = (paramName: WalletValueKeys, paramValue: string) => {
    if ((values[paramName] as string) !== paramValue) {
      setValues({ ...values, [paramName]: paramValue });
    }
  };

  return (
    <AppFrame
      title="Restore Wallet"
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
                    {restoring ? (
                      <CircularProgress size={20} className="color-white" />
                    ) : null}
                    &nbsp;Restore
                  </React.Fragment>
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
        <MnemonicRestore
          mnemonic={values.mnemonic}
          mnemonicPassphrase={values.mnemonicPassphrase}
          networkType={values.network}
          setHasError={setHasError}
          setMnemonic={(mnemonic) => setParam('mnemonic', mnemonic)}
          setMnemonicPassphrase={(mnemonicPassphrase) =>
            setParam('mnemonicPassphrase', mnemonicPassphrase)
          }
          setReadOnlyWalletId={(value: number) =>
            setValues({ ...values, readOnlyWalletId: value })
          }
        />
        <AddressConfirm
          mnemonic={values.mnemonic}
          network={values.network}
          mnemonicPassphrase={values.mnemonicPassphrase}
        />
        <WalletPassword
          password={values.password}
          setPassword={(password) => setParam('password', password)}
          setHasError={setHasError}
        />
      </Stepper>
    </AppFrame>
  );
};

export default WalletRestore;
