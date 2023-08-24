import React, { useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, IconButton, Stack } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Stepper from '../../components/Stepper';
import AmountToSend from './steps/AmountToSend';
import EnterPassword from './steps/EnterPassword';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import TransactionBoxes from './TransactionBoxes';
import SuccessSend from './SuccessSend';
import NextIcon from '@mui/icons-material/ArrowForwardIos';

const NormalSend = () => {
  const navigate = useNavigate();
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const [step, setStep] = useState(1);
  const [waiting, setWaiting] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(false);
  const STEPS_COUNTS = 2;

  const handleBack = () => {
    if (step > 1) setStep((prevState) => prevState - 1);
    else navigate(-1);
  };
  const handleNext = () => {
    if (step < STEPS_COUNTS) {
      setStep((prevState) => prevState + 1);
    } else {
      setWaiting(true);
      setTimeout(() => {
        setWaiting(false);
        setSucceeded(true);
      }, 2000);
    }
  };
  const handleDisplayBoxes = () => {
    setDisplayBoxes(true);
  };
  const handleHideBoxes = () => {
    setDisplayBoxes(false);
  };
  const handleClose = () => {
    setSucceeded(false);
    setStep(1);
    console.log('finished.');
  };

  return (
    <AppFrame
      title="Send"
      navigation={<BackButton onClick={handleBack} />}
      actions={
        step === STEPS_COUNTS ? (
          <IconButton onClick={handleDisplayBoxes}>
            <InventoryIcon />
          </IconButton>
        ) : undefined
      }
      toolbar={
        <>
          <Stack spacing={2}>
            <Button
              onClick={handleNext}
              endIcon={step === STEPS_COUNTS ? undefined : <NextIcon />}
            >
              {step === STEPS_COUNTS ? 'Send' : 'Next'}
            </Button>
            {step === STEPS_COUNTS && <Button variant="outlined">Save</Button>}
          </Stack>
        </>
      }
    >
      <Stepper activeStep={step}>
        <AmountToSend />
        <EnterPassword />
      </Stepper>
      <TransactionBoxes open={displayBoxes} handleClose={handleHideBoxes} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SuccessSend
        open={succeeded}
        handleClose={handleClose}
        id={'6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef'}
      />
    </AppFrame>
  );
};

export default NormalSend;
