import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GlobalStateType } from '@minotaur-ergo/types';
import {
  createEmptyArray,
  MAIN_NET_LABEL,
  TEST_NET_LABEL,
} from '@minotaur-ergo/utils';
import { Button, CircularProgress, Grid } from '@mui/material';

import { createMultiSigWallet } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import Stepper from '@/components/stepper/Stepper';
import AppFrame from '@/layouts/AppFrame';

import AddressConfirmMultiSig from '../components/address-confirm/AddressConfirmMultiSig';
import WalletName from '../components/wallet-name/WalletName';
import WalletSigners from '../components/wallet-signers/WalletSigners';
import XPubSelect from '../components/xpub-select/XPubSelect';

type WalletValueKeysString = 'name' | 'walletId' | 'network';

type WalletValueKeysNumber = 'signers' | 'threshold';

const WalletAddMultiSig = () => {
  const context = useContext(MessageContext);
  const navigate = useNavigate();
  const {
    mainnetSyncWithNode,
    testnetSyncWithNode,
    mainnetNodeAddress,
    testnetNodeAddress,
  } = useSelector((state: GlobalStateType) => state.config);
  const STEPS_COUNTS = 4;
  const [step, setStep] = useState(1);
  const [hasError, setHasError] = useState(true);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState({
    name: '',
    version: 1,
    network: MAIN_NET_LABEL,
    xPubs: [''],
    threshold: 2,
    signers: 2,
    walletId: '',
  });
  const handleBack = () => {
    if (step > 1) setStep((prevState) => prevState - 1);
    else navigate(-1);
  };

  const handleNext = () => {
    if (step < STEPS_COUNTS) setStep((prevState) => prevState + 1);
    else create();
  };
  const setParamString =
    (paramName: WalletValueKeysString) => (paramValue: string) => {
      if ((values[paramName] as string) !== paramValue) {
        setValues({ ...values, [paramName]: paramValue });
      }
    };
  const setParamNumber =
    (paramName: WalletValueKeysNumber) => (paramValue: number) => {
      if ((values[paramName] as number) !== paramValue) {
        setValues({ ...values, [paramName]: paramValue });
      }
    };

  const setSignersCount = (count: number) => {
    if (count !== values.signers) {
      const newValues = {
        ...values,
        signers: count,
        xPubs: createEmptyArray(count - 1, ''),
      };
      setValues(newValues);
    }
  };
  const setXPubs = (xPubs: Array<string>) => {
    setValues({
      ...values,
      xPubs: xPubs,
    });
  };
  const create = () => {
    if (!creating) {
      setCreating(true);
      createMultiSigWallet(
        values.name,
        parseInt(values.walletId),
        values.xPubs,
        values.threshold,
        // sync with node?
        (values.network === MAIN_NET_LABEL && mainnetSyncWithNode) ||
          (values.network === TEST_NET_LABEL && testnetSyncWithNode),
        // node url
        values.network === MAIN_NET_LABEL
          ? mainnetNodeAddress
          : testnetNodeAddress,
      )
        .then(() => {
          navigate(-2);
        })
        .catch((exp) => {
          context.insert(exp, 'error');
          setCreating(false);
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
          setName={setParamString('name')}
          network={values.network}
          setNetwork={setParamString('network')}
        />
        <WalletSigners
          setHasError={setHasError}
          signers={values.signers}
          threshold={values.threshold}
          setSigners={setSignersCount}
          setThreshold={setParamNumber('threshold')}
        />
        <XPubSelect
          networkType={values.network}
          setHasError={setHasError}
          xPubs={values.xPubs}
          setXPub={setXPubs}
          walletId={values.walletId}
          setWalletId={setParamString('walletId')}
        />
        <AddressConfirmMultiSig
          xPubs={values.xPubs}
          threshold={values.threshold}
          signers={values.signers}
          walletId={values.walletId}
          version={values.version}
        />
      </Stepper>
    </AppFrame>
  );
};

export default WalletAddMultiSig;
