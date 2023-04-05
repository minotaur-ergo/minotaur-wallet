import React, { useMemo, useState } from 'react';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Stepper from '../../../components/Stepper';
import WalletName from './components/WalletName';
import WalletSigners from './components/WalletSigners';

export interface WalletDataType {
  name: string;
  total: number;
  minSign: number;
}

const MultiSigWallet = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', total: 2, minSign: 2 });
  const STEPS_COUNTS = 2;

  const disableNext = useMemo(() => {
    if (step === 1) {
      return data.name.length === 0;
    }
    return true;
  }, [step, data]);

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
      title="Add Multi-signature Wallet"
      navigation={<BackButton onClick={handleBack} />}
      toolbar={
        <Button onClick={handleNext} disabled={disableNext}>
          {step === STEPS_COUNTS ? 'Submit' : 'Next'}
        </Button>
      }
    >
      <Stepper activeStep={step}>
        <WalletName data={data} setData={setData} />
        <WalletSigners data={data} setData={setData} />
      </Stepper>
    </AppFrame>
  );
};

export default MultiSigWallet;
