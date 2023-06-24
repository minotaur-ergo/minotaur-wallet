import React, { ReactElement, useRef, useState } from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';

export interface ActionButtonPropsType {
  label: string;
  onClick?: () => Promise<string | undefined> | void;
  helperText?: string;
  icon?: ReactElement;
}

export default function ({
  label,
  onClick,
  helperText,
  icon,
}: ActionButtonPropsType) {
  const [loading, set_loading] = useState(false);
  const alert = useRef<SnackAlertHandle>(null);

  const handle_click = () => {
    set_loading(true);
    if (onClick) {
      onClick()
        ?.then((message) => {
          if (message) {
            alert.current?.set(message, 'success');
            alert.current?.open();
          }
        })
        .catch((message) => {
          if (message) {
            alert.current?.set(message, 'error');
            alert.current?.open();
          }
        })
        .finally(() => {
          set_loading(false);
        });
    }
  };

  return (
    <Box px={1.5}>
      <Box display="flex" sx={{ alignItems: 'center' }}>
        <Typography sx={{ flexGrow: 1 }}>{label}</Typography>
        <IconButton
          edge="end"
          onClick={handle_click}
          disabled={loading || !onClick}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            icon ?? <ChevronRightIcon />
          )}
        </IconButton>
      </Box>
      {helperText && (
        <Typography
          color="textSecondary"
          fontSize="0.75rem"
          letterSpacing="0.03333em"
          sx={{ mt: -1 }}
        >
          {helperText}
        </Typography>
      )}
      <SnackAlert ref={alert} />
    </Box>
  );
}
