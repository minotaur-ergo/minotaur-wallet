import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import Stepper from '../../../components/Stepper';
import WalletName from './components/WalletName';
import WalletMnemonic from './components/WalletMnemonic';
import ConfirmMnemonic from './components/ConfirmMnemonic';
import WalletPassword from './components/WalletPassword';

const CreateWallet = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const MNEMONIC_STEP_NUM = 2;
  const STEPS_COUNTS = 4;

  const handleBack = () => {
    if (step > 1) setStep((prevState) => prevState - 1);
    else navigate(-1);
  };
  const handleNext = () => {
    if (step < STEPS_COUNTS) setStep((prevState) => prevState + 1);
    else console.log('submit');
  };

  return (
    <AppFrame
      title="Create New Wallet"
      navigation={<BackButton onClick={handleBack} />}
      toolbar={
        <Button onClick={handleNext}>
          {step === STEPS_COUNTS
            ? 'Submit'
            : step === MNEMONIC_STEP_NUM
            ? "I've write it down"
            : 'Next'}
        </Button>
      }
    >
      <Stepper activeStep={step}>
        <WalletName />
        <WalletMnemonic />
        <ConfirmMnemonic />
        <WalletPassword />
      </Stepper>
    </AppFrame>
  );
};

export default CreateWallet;
