import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

interface ConfirmPropsType {
  open: boolean;
  close: () => unknown;
  confirmTitle: string;
  confirmDescription?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  resolve: (arg?: string) => unknown;
  reject?: () => unknown;
}

const Confirm = (props: ConfirmPropsType) => {
  const handle_cancel = () => {
    props.close();
    props.reject ? props.reject() : null;
  };
  const handle_confirm = () => {
    props.close();
    props.resolve();
  };
  return (
    <Drawer anchor="bottom" open={props.open} onClose={handle_cancel}>
      <Typography fontWeight="bold" sx={{ mt: 2 }}>
        {props.confirmTitle}
      </Typography>
      {props.confirmDescription && (
        <Typography sx={{ mb: 1 }}>{props.confirmDescription}</Typography>
      )}
      <Stack direction="row-reverse" spacing={2}>
        <Button
          onClick={handle_confirm}
          variant="text"
          fullWidth={false}
          sx={{ px: 0, minWidth: 0 }}
        >
          {props.confirmButtonText ? props.confirmButtonText : 'OK'}
        </Button>
        <Button
          onClick={handle_cancel}
          variant="text"
          fullWidth={false}
          sx={{ px: 0, minWidth: 0 }}
        >
          {props.cancelButtonText ? props.cancelButtonText : 'Cancel'}
        </Button>
      </Stack>
    </Drawer>
  );
};

export default Confirm;
