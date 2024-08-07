import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { useMemo, useState } from 'react';
import { RegistrationType } from '../../../models';
import { REGISTRATION } from '../../../data';
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ContentPasteOutlined,
  DeleteOutlineOutlined,
} from '@mui/icons-material';
import SignaturesList from '../transaction/SignaturesList';
import ActionButtonWithConfirm from '../../settings/ActionButtonWithConfirm';

const MultiSigRegistration = () => {
  const [registrationState] = useState<RegistrationType>(REGISTRATION);
  const registerCount = useMemo(
    () => registrationState.signers.filter((i) => i.signed).length,
    [registrationState]
  );

  const handleUnregister = () =>
    new Promise<string | undefined>((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    });

  return (
    <AppFrame
      title="Multi-sig Registration"
      navigation={<BackButton />}
      toolbar={
        registrationState.status === 'NONE' ? (
          <Button>Register</Button>
        ) : undefined
      }
    >
      <Stack spacing={2}>
        {registrationState.status === 'NONE' && (
          <>
            <Typography color="text.secondary">
              To register the multi-sig communication, enter the URL...
            </Typography>
            <TextField
              label="URL"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <ContentPasteOutlined />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}
        {(registrationState.status === 'WAITING' ||
          registrationState.status === 'REGISTERED') && (
          <>
            <Alert
              severity={
                registrationState.status === 'WAITING' ? 'warning' : 'success'
              }
              icon={false}
            >
              <AlertTitle>
                {registrationState.status === 'WAITING'
                  ? `${
                      registrationState.requiredSignatures - registerCount
                    } more registers!`
                  : 'Registered!'}
              </AlertTitle>
              {registerCount} of {registrationState.requiredSignatures} required
              signers are registered.
            </Alert>
            <SignaturesList
              title="Registered signers"
              signatures={registrationState.signers}
            />
            <ActionButtonWithConfirm
              label="Unregister"
              helperText="Some description about this option goes here."
              icon={<DeleteOutlineOutlined />}
              confirmButtonText="Unregister"
              confirmTitle="Unregister?!"
              confirmDescription="Are you sure you want to unregister?"
              onClick={handleUnregister}
              disableGutters
              color="error"
            />
          </>
        )}
      </Stack>
    </AppFrame>
  );
};

export default MultiSigRegistration;
