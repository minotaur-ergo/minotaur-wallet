import {
  Button,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface ConfirmDrawerPropsType {
  title: string;
  description?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  displayCancelButton?: boolean;
  onConfirm?(): Promise<boolean>;
}

export interface ConfirmDrawerHandle {
  open: () => void;
}

const ConfirmDrawer = forwardRef<ConfirmDrawerHandle, ConfirmDrawerPropsType>(
  (props, ref) => {
    const {
      title,
      description,
      confirmButtonLabel = 'Confirm',
      cancelButtonLabel = 'Cancel',
      displayCancelButton = true,
      onConfirm,
    } = props;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handle_confirm = () => {
      if (onConfirm) {
        setIsLoading(true);
        onConfirm()
          .then((wasSuccess) => {
            setOpen(!wasSuccess);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setOpen(false);
      }
    };
    const handle_cancel = () => {
      setOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open() {
        setOpen(true);
      },
    }));

    return (
      <Drawer anchor="bottom" open={open}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          {title}
        </Typography>
        {description && <Typography>{description}</Typography>}
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handle_confirm}
            variant="text"
            fullWidth={false}
            disabled={isLoading}
            sx={{ px: 0, minWidth: 0 }}
          >
            {isLoading ? <CircularProgress /> : confirmButtonLabel}
          </Button>
          {displayCancelButton && (
            <Button
              onClick={handle_cancel}
              variant="text"
              fullWidth={false}
              disabled={isLoading}
              sx={{ px: 0, minWidth: 0 }}
            >
              {cancelButtonLabel}
            </Button>
          )}
        </Stack>
      </Drawer>
    );
  }
);

export default ConfirmDrawer;
