import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { createWallet } from '@/action/wallet';
import AppFrame from '@/layouts/AppFrame';
import Stepper from '@/components/stepper/Stepper';
import WalletName from '../components/wallet-name/WalletName';
import WalletPassword from '../components/wallet-password/WalletPassword';
import CircularProgress from '@mui/material/CircularProgress';
import { WalletType } from '@/db/entities/Wallet';
import MessageContext from '@/components/app/messageContext';
import { MnemonicRestore } from '../components/mnemonic-restore/MnemonicRestore';
import AddressConfirm from '../components/address-confirm/AddressConfirm';
import { MAIN_NET_LABEL } from '@/utils/const';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

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
          setHasError={setHasError}
          setMnemonic={(mnemonic) => setParam('mnemonic', mnemonic)}
          setMnemonicPassphrase={(mnemonicPassphrase) =>
            setParam('mnemonicPassphrase', mnemonicPassphrase)
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
