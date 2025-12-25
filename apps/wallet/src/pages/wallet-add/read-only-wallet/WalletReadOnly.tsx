import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GlobalStateType } from '@minotaur-ergo/types';
import {
  getBase58ExtendedPublicKey,
  MAIN_NET_LABEL,
  TEST_NET_LABEL,
} from '@minotaur-ergo/utils';
import { Button, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { createReadOnlyWallet } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import Stepper from '@/components/stepper/Stepper';
import AppFrame from '@/layouts/AppFrame';

import AddressOrXPub from '../components/address-or-xpub/AddressOrXPub';
import WalletName from '../components/wallet-name/WalletName';

type WalletValueKeys = 'name' | 'network' | 'public';

const WalletReadOnly = () => {
  const context = useContext(MessageContext);
  const navigate = useNavigate();
  const {
    mainnetExplorerUrl,
    testnetExplorerUrl,
    mainnetSyncWithNode,
    testnetSyncWithNode,
    mainnetNodeAddress,
    testnetNodeAddress,
  } = useSelector((state: GlobalStateType) => state.config);
  const [step, setStep] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState({
    name: '',
    network: MAIN_NET_LABEL,
    public: '',
  });
  const STEPS_COUNTS = 2;

  const create = () => {
    if (!creating) {
      setCreating(true);
      const xPub = getBase58ExtendedPublicKey(values.public);
      createReadOnlyWallet(
        values.name,
        xPub ? ' ' : values.public,
        xPub ? xPub : '',
        values.network,
        // explorer url
        values.network === MAIN_NET_LABEL
          ? mainnetExplorerUrl
          : testnetExplorerUrl,
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

  const handleNext = () => {
    if (step < STEPS_COUNTS) setStep((prevState) => prevState + 1);
    else create();
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
      title="Read Only Wallet"
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
          setName={(name) => setParam('name', name)}
          network={values.network}
          setNetwork={(network) => setParam('network', network)}
        >
          <Typography color="red">
            This is a read-only wallet and cannot be used to sign any
            transaction. You need the corresponding cold wallet in order to sign
            transactions and send funds from this wallet.
            <br />
          </Typography>
        </WalletName>
        <AddressOrXPub
          label="Address or Extended public key"
          value={values.public}
          setHasError={setHasError}
          setValue={(newValue) => setParam('public', newValue)}
        />
      </Stepper>
    </AppFrame>
  );
};

export default WalletReadOnly;
