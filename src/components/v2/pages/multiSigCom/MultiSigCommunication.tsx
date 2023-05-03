import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, Typography } from '@mui/material';

const MultiSigCommunication = () => {
  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButton />}>
      <Typography sx={{ mb: 2 }}>
        Some hints or descriptions about this page goe here.
      </Typography>
      <Button>Paste from Clipboard</Button>
      <Typography textAlign="center" sx={{ my: 1 }}>
        or
      </Typography>
      <Button>Scan QR Code</Button>
    </AppFrame>
  );
};

export default MultiSigCommunication;
