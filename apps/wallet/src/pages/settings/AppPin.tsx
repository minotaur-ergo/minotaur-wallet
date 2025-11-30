import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GlobalStateType } from '@minotaur-ergo/types';
import { getPinHash } from '@minotaur-ergo/utils';
import { Button, Stack } from '@mui/material';

import { PinDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import PasswordField from '@/components/password-field/PasswordField';
import { setPinConfig } from '@/store/reducer/config';

import AppFrame from '../../layouts/AppFrame';

const AppPin = () => {
  const [oldPinHash, setOldPinHash] = useState('');
  const navigate = useNavigate();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [loadingPinType, setLoadingPinType] = useState('-');

  const pinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const hasPin = useSelector(
    (state: GlobalStateType) => state.config.pin.hasPin,
  );

  useEffect(() => {
    if (hasPin && oldPinHash !== '' && loadingPinType !== pinType) {
      setLoadingPinType(pinType);
      PinDbAction.getInstance()
        .getPinOfType(pinType)
        .then((res) => {
          if (res) {
            setOldPinHash(res.value);
          }
        });
    }
  }, [hasPin, loadingPinType, oldPinHash, pinType]);
  const newPinHash = useMemo(() => getPinHash(newPin), [newPin]);
  const oldPinValid = newPinHash !== oldPinHash;
  const newPinValid = newPin === newPinConfirm && newPin !== '';
  const isValid = oldPinValid && newPinValid;
  const message = useContext(MessageContext);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (isValid) {
      PinDbAction.getInstance()
        .setPin(getPinHash(newPin), pinType)
        .then(() => {
          message.insert(
            `successfully ${hasPin ? 'changed' : 'set'}`,
            'success',
          );
          dispatch(setPinConfig({ hasPin: true }));
          navigate(-1);
        });
    }
  };
  return (
    <AppFrame
      title={hasPin ? 'Change PIN' : 'Set PIN'}
      navigation={<BackButtonRouter />}
      toolbar={
        <Button disabled={!isValid} onClick={handleSubmit}>
          Save
        </Button>
      }
    >
      <Stack spacing={2}>
        {hasPin ? (
          <PasswordField
            setPassword={setOldPin}
            password={oldPin}
            label="Old PIN"
          />
        ) : undefined}

        <PasswordField
          setPassword={setNewPin}
          password={newPin}
          label="New PIN"
        />
        <PasswordField
          setPassword={setNewPinConfirm}
          password={newPinConfirm}
          label="Confirm New PIN"
        />
      </Stack>
    </AppFrame>
  );
};

export default AppPin;
