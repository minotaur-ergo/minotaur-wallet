import React from 'react';

import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';

interface CloseSnackbarProps {
  msgKey: SnackbarKey;
}

const CloseButton: React.FC<CloseSnackbarProps> = ({ msgKey }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      aria-label="Close notification"
      color="inherit"
      onClick={() => closeSnackbar(msgKey)}
    >
      <Close fontSize="small" />
    </IconButton>
  );
};

export default CloseButton;
