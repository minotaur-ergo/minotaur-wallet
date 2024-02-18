import { Inventory2Outlined } from '@mui/icons-material';
import PrevIcon from '@mui/icons-material/ArrowBackIos';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Grid, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/back-button/BackButton';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import Stepper from '@/components/stepper/Stepper';
import AppFrame from '@/layouts/AppFrame';
import { StateWallet } from '@/store/reducer/wallet';
import SendAmount from './send-amount/SendAmount';
import SignTx from './sign-tx/SignTx';
import { getSignButtonLabel } from '@/utils/functions';

interface WalletSendPropsType {
  wallet: StateWallet;
}

const WalletSend = (props: WalletSendPropsType) => {
  const STEPS_COUNTS = 2;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasError, setHasError] = useState(false);
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const handleNext = () => {
    if (step === STEPS_COUNTS) {
      txSignContext.handle();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step !== 1) {
      setStep(step - 1);
    }
  };

  const handleSetHasError = (newHasError: boolean) => {
    if (hasError !== newHasError) {
      setHasError(newHasError);
    }
  };

  const getNextLabel = () => {
    if (step < STEPS_COUNTS) return 'Next';
    return getSignButtonLabel(props.wallet.type);
  };

  return (
    <AppFrame
      title="Send"
      navigation={<BackButton onClick={() => navigate(-1)} />}
      actions={
        step === STEPS_COUNTS && txDataContext.tx ? (
          <IconButton onClick={() => setDisplayBoxes(true)}>
            <Inventory2Outlined />
          </IconButton>
        ) : undefined
      }
      toolbar={
        <React.Fragment>
          <Grid container spacing={2}>
            {step === 1 ? null : (
              <Grid item xs={6}>
                <Button onClick={handlePrev} startIcon={<PrevIcon />}>
                  Back
                </Button>
              </Grid>
            )}
            <Grid item xs={step === 1 ? 12 : 6}>
              <Button
                disabled={hasError}
                onClick={handleNext}
                endIcon={step === STEPS_COUNTS ? undefined : <NextIcon />}
              >
                {getNextLabel()}
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      }
    >
      <Stepper activeStep={step}>
        <SendAmount setHasError={handleSetHasError} wallet={props.wallet} />
        <SignTx wallet={props.wallet} setHasError={handleSetHasError} />
      </Stepper>
      <TransactionBoxes
        open={displayBoxes}
        handleClose={() => setDisplayBoxes(false)}
      />
    </AppFrame>
  );
};

export default WalletSend;
