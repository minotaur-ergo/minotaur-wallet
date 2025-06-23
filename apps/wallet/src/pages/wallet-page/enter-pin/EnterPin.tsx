import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Typography } from '@mui/material';

import { PinDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';
import PasswordField from '@/components/password-field/PasswordField';
import AppFrame from '@/layouts/AppFrame';
import { setPinConfig } from '@/store/reducer/config';
import { getPinHash } from '@/utils/convert';

const MAX_TRY_COUNT = 3;

const EnterPin = () => {
  const [pin, setPin] = useState('');
  const [tryCount, setTryCount] = useState(0);
  const dispatch = useDispatch();
  const message = useContext(MessageContext);
  const handleSubmit = () => {
    if (tryCount < MAX_TRY_COUNT) {
      setTryCount(tryCount + 1);
      const pinHash = getPinHash(pin);
      PinDbAction.getInstance()
        .findPinByValue(pinHash)
        .then((foundPin) => {
          if (foundPin === null) {
            message.insert('Invalid pin entered', 'error');
            setPin('');
          } else {
            setTryCount(0);
            dispatch(
              setPinConfig({ locked: false, activeType: foundPin.type }),
            );
          }
        });
    }
  };

  return (
    <AppFrame
      title="Enter Pin"
      toolbar={
        <Button disabled={tryCount >= MAX_TRY_COUNT} onClick={handleSubmit}>
          Unlock
        </Button>
      }
    >
      <Typography mb={2}>
        Please enter your wallet pin to unlock wallet
      </Typography>
      <PasswordField password={pin} setPassword={setPin} label="Pin" />
      {tryCount >= MAX_TRY_COUNT ? (
        <Typography mb={2} color={'red'}>
          Tried 3 times with wrong pin. Please Close application and try again.
        </Typography>
      ) : undefined}
    </AppFrame>
  );
};

export default EnterPin;
