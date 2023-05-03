import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface PropsType {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number | null | undefined;
}
export type SnackAlertHandle = {
  open: () => void;
};

const SnackAlert = forwardRef<SnackAlertHandle, PropsType>((props, ref) => {
  const { message, severity = 'success', autoHideDuration = 2000 } = props;
  const [open, set_open] = useState<boolean>(false);
  const handle_close = () => set_open(false);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        set_open(true);
      },
    }),
    []
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handle_close}
    >
      <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
});

export default SnackAlert;
