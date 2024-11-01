import ActionButton from '@/pages/settings/ActionButton';
import React, { Fragment, useState, useRef } from 'react';
import { Stack, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Button, { ButtonProps } from '@mui/material/Button';

interface ActionWithConfirmPropsType {
  label: string;
  onClick?: () => Promise<string | undefined> | void;
  helperText?: string;
  icon?: React.ReactElement;
  disabled?: boolean;
  confirmTitle: string;
  confirmDescription?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  color?: ButtonProps['color'];
}

type OnConfirmType = {
  resolve: (message: string | undefined) => void;
  reject: (message: string | undefined) => void;
};

const ActionWithConfirm = ({
  label,
  onClick,
  helperText,
  icon,
  confirmTitle,
  confirmDescription,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  color,
}: ActionWithConfirmPropsType) => {
  const [open, set_open] = useState(false);
  const onConfirm = useRef<OnConfirmType>({
    resolve: () => {
      return;
    },
    reject: () => {
      return;
    },
  });

  const handle_open = () => {
    set_open(true);
    return new Promise<string | undefined>((resolve, reject) => {
      onConfirm.current = { resolve, reject };
    });
  };
  const handle_cancel = () => {
    set_open(false);
    onConfirm.current.resolve(undefined);
  };
  const handle_confirm = () => {
    set_open(false);
    if (onClick) {
      onClick()
        ?.then((response) => {
          onConfirm.current.resolve(response);
        })
        .catch((reason) => {
          onConfirm.current.reject(reason);
        });
    }
  };

  return (
    <Fragment>
      <ActionButton
        label={label}
        helperText={helperText}
        icon={icon}
        onClick={onClick ? handle_open : undefined}
      />
      <Drawer anchor="bottom" open={open} onClose={handle_cancel}>
        <Typography fontWeight="bold" sx={{ mt: 2 }}>
          {confirmTitle}
        </Typography>
        {confirmDescription && (
          <Typography sx={{ mb: 1 }}>{confirmDescription}</Typography>
        )}
        <Stack direction="row-reverse" spacing={2} color="text.secondary">
          <Button
            onClick={handle_confirm}
            variant="text"
            color={color}
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            {confirmButtonText}
          </Button>
          <Button
            onClick={handle_cancel}
            variant="text"
            color="inherit"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            {cancelButtonText}
          </Button>
        </Stack>
      </Drawer>
    </Fragment>
  );
};

export default ActionWithConfirm;
