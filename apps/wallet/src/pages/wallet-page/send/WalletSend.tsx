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
import SignButtonLabel from '@/components/sign-button-label/SignButtonLabel';

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
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const mapErrorToMessage = (err: unknown): string => {
    if (!err) return 'An unknown error occurred.';
    if (typeof err === 'string') return err;
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      if (msg.includes('insufficient')) return 'Your balance is too low.';
      if (msg.includes('network')) return 'Network error. Try again later.';
      if (msg.includes('timeout'))
        return 'Request timed out. Check your connection.';
      if (msg.includes('signature')) return 'Signing failed. Try again.';
      return err.message;
    }
    return JSON.stringify(err);
  };

  const handleNext = async () => {
    if (step === STEPS_COUNTS) {
      try {
        setIsSigning(true);
        await txSignContext.handle();
        setIsSigning(false);

        if (txSignContext.error) {
          const message = mapErrorToMessage(txSignContext.error);
          txSignContext.setError(txSignContext.error);
          setDisplayError(message);
          setHasError(true);
          return;
        }

        setDisplayError(null);
        setHasError(false);
      } catch (err) {
        console.error('Signing Error:', err);
        const message = mapErrorToMessage(err);
        txSignContext.setError(err);
        setDisplayError(message);
        setHasError(true);
        return;
      }
    }

    setStep((prev) => prev + 1);
    setDisplayError(null);
    setHasError(false);
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
    return <SignButtonLabel wallet={props.wallet} />;
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
                disabled={hasError || isSigning}
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
        <SignTx
          wallet={props.wallet}
          setHasError={handleSetHasError}
          displayError={displayError}
          clearError={() => setDisplayError(null)}
        />
      </Stepper>
      <TransactionBoxes
        open={displayBoxes}
        handleClose={() => setDisplayBoxes(false)}
      />
    </AppFrame>
  );
};

export default WalletSend;
