import { PinDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import PasswordField from '@/components/password-field/PasswordField';
import { GlobalStateType } from '@/store';
import { honeyPinType, pinHash } from '@/utils/convert';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import AppFrame from '../../layouts/AppFrame';
import { Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';

enum PinActionType {
  Update = 'UPDATE',
  Delete = 'DELETE',
}

const WalletSetPin = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState<PinActionType>(PinActionType.Update);
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const pinType = honeyPinType(
    useSelector((state: GlobalStateType) => state.config.pin.activePinType),
  );
  const message = useContext(MessageContext);
  const handleSubmit = async () => {
    if (isValid) {
      if (action === PinActionType.Update) {
        await PinDbAction.getInstance().setPin(pinHash(newPin), pinType);
      } else {
        PinDbAction.getInstance().deletePinType(pinType).then();
      }
      message.insert(
        `successfully ${action === PinActionType.Update ? 'changed' : 'deleted'}`,
        'success',
      );
      navigate(-1);
    }
    navigate(-1);
  };
  const handleChangeAction = (
    _: React.MouseEvent<HTMLElement>,
    newAction: PinActionType,
  ) => {
    if (newAction) setAction(newAction);
  };
  const newPinValid = newPin === newPinConfirm && newPin !== '';
  const isValid = action === PinActionType.Update ? newPinValid : true;

  return (
    <AppFrame
      title="Set/Change honey pin"
      navigation={<BackButtonRouter />}
      toolbar={
        <Button
          disabled={!isValid}
          onClick={() => handleSubmit().then(() => null)}
        >
          {action === PinActionType.Update ? 'Save' : 'Delete'}
        </Button>
      }
    >
      <Stack spacing={2}>
        <ToggleButtonGroup
          value={action}
          onChange={handleChangeAction}
          exclusive
          color="primary"
        >
          <ToggleButton value={PinActionType.Update}>Set/Edit</ToggleButton>
          <ToggleButton value={PinActionType.Delete}>Remove</ToggleButton>
        </ToggleButtonGroup>
        {action === PinActionType.Update && (
          <>
            <PasswordField
              password={newPin}
              setPassword={setNewPin}
              label="Honey Pin"
            />
            <PasswordField
              password={newPinConfirm}
              setPassword={setNewPinConfirm}
              label="Confirm Honey Pin"
            />
          </>
        )}
      </Stack>
    </AppFrame>
  );
};

export default WalletSetPin;
