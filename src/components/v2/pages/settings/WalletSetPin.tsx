import React, { useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { useNavigate } from 'react-router-dom';

type PinActionType = 'UPDATE' | 'DELETE';

const WalletSetPin = () => {
  const navigate = useNavigate();
  const [action, set_action] = useState<PinActionType>('UPDATE');
  const hasPin = true;

  const handle_submit = () => {
    navigate(-1);
  };
  const handle_change_action = (
    event: React.MouseEvent<HTMLElement>,
    newAction: PinActionType
  ) => {
    if (newAction) set_action(newAction);
  };

  return (
    <AppFrame
      title={hasPin ? 'Change pin' : 'Set pin'}
      navigation={<BackButton />}
      toolbar={<Button onClick={handle_submit}>Submit</Button>}
    >
      {hasPin ? (
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={action}
            onChange={handle_change_action}
            exclusive
            color="primary"
          >
            <ToggleButton value="UPDATE">Edit</ToggleButton>
            <ToggleButton value="DELETE">Remove</ToggleButton>
          </ToggleButtonGroup>
          <PasswordField label="Old Pin" />
          {action === 'UPDATE' && (
            <>
              <PasswordField label="New Pin" />
              <PasswordField label="Repeat Pin" />
            </>
          )}
        </Stack>
      ) : (
        <Stack spacing={2}>
          <PasswordField label="New Pin" />
          <PasswordField label="Repeat Pin" />
        </Stack>
      )}
    </AppFrame>
  );
};

export default WalletSetPin;
