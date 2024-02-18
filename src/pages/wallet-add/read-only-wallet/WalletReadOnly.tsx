import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import { createReadOnlyWallet } from '@/action/wallet';
import AppFrame from '@/layouts/AppFrame';
import Stepper from '@/components/stepper/Stepper';
import WalletName from '../components/wallet-name/WalletName';
import CircularProgress from '@mui/material/CircularProgress';
import MessageContext from '@/components/app/messageContext';
import { MAIN_NET_LABEL } from '@/utils/const';
import AddressOrXPub from '../components/address-or-xpub/AddressOrXPub';
import { getBase58ExtendedPublicKey } from '@/utils/functions';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

type WalletValueKeys = 'name' | 'network' | 'public';

const WalletReadOnly = () => {
  const context = useContext(MessageContext);
  const navigate = useNavigate();
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
        xPub ? xPub : ' ',
        values.network,
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
