import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WalletType } from '@minotaur-ergo/types';
import { Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { WalletDbAction } from '@/action/db';
import { createWallet } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import Stepper from '@/components/stepper/Stepper';
import Wallet from '@/db/entities/Wallet';
import AppFrame from '@/layouts/AppFrame';
import { MAIN_NET_LABEL } from '@/utils/const';

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
  const [readonlyWalletFound, setReadonlyWalletFound] = useState<Wallet | null>(
    null,
  );
  const [convertReadonly, setConvertReadonly] = useState(false);
  const [values, setValues] = useState({
    name: '',
    network: MAIN_NET_LABEL,
    mnemonic: '',
    mnemonicPassphrase: '',
    password: '',
  });
  const STEPS_COUNTS = 4;

  const restore = async () => {
    if (restoring) return;
    setRestoring(true);

    try {
      if (readonlyWalletFound && convertReadonly) {
        await WalletDbAction.getInstance().updateWallet(
          readonlyWalletFound.id,
          {
            type: WalletType.Normal,
            seed: values.mnemonic,
            encrypted_mnemonic: values.mnemonicPassphrase,
          },
        );
        setHasError(true);
        navigate(-2);
        return;
      }

      await createWallet(
        values.name,
        WalletType.Normal,
        values.mnemonic,
        values.mnemonicPassphrase,
        values.network,
        values.password,
      );
      navigate(-2);
    } catch (exp) {
      context.insert(exp instanceof Error ? exp.message : String(exp), 'error');
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
          setReadonlyWalletFound={setReadonlyWalletFound}
          setConvertReadonly={setConvertReadonly}
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
