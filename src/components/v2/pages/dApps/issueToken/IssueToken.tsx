import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import Stepper from '../../../components/Stepper';
import TransactionBoxes from '../../send/TransactionBoxes';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import SuccessSend from '../../send/SuccessSend';
import IssueTokenForm from './components/IssueTokenForm';
import IssueTokenPassword from './components/IssueTokenPassword';

const IssueToken = () => {
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
      title="Issue Token"
      navigation={<BackButton onClick={handleBack} />}
      actions={
        step === STEPS_COUNTS ? (
          <IconButton onClick={handleDisplayBoxes}>
            <InventoryIcon />
          </IconButton>
        ) : undefined
      }
      toolbar={
        <Button onClick={handleNext}>
          {step === STEPS_COUNTS ? 'Send' : 'Next'}
        </Button>
      }
    >
      <Stepper activeStep={step}>
        <IssueTokenForm />
        <IssueTokenPassword />
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

export default IssueToken;
