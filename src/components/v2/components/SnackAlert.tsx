import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
} from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface PropsType {
  message?: string;
  severity?: AlertColor;
  autoHideDuration?: number | null | undefined;
}
export type SnackAlertHandle = {
  open: () => void;
  set: (newMessage: string, newSeverity: AlertColor) => void;
  setMessage: (newMessage: string) => void;
};

const SnackAlert = forwardRef<SnackAlertHandle, PropsType>((props, ref) => {
  const { message, severity, autoHideDuration = 2000 } = props;
  const [open, set_open] = useState<boolean>(false);
  const [_message, set_message] = useState<string>(message || '');
  const [_severity, set_severity] = useState<AlertColor>(severity || 'success');
  const handle_close = () => set_open(false);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        set_open(true);
      },
      set(newMessage, newSeverity) {
        set_message(newMessage);
        set_severity(newSeverity);
      },
      setMessage(newMessage) {
        set_message(newMessage);
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
      <Alert severity={_severity} variant="filled" sx={{ width: '100%' }}>
        {_message}
      </Alert>
    </Snackbar>
  );
});

export default SnackAlert;
