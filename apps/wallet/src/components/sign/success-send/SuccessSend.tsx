import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import { openTxInBrowser } from '../../../action/tx';
import SvgIcon from '../../../icons/SvgIcon';
import DisplayId from '../../display-id/DisplayId';
import StateMessage from '../../state-message/StateMessage';

interface SuccessSendPropsType {
  open: boolean;
  handleClose: () => void;
  id?: string;
  networkType: string;
  msg: string;
  isSuccess: boolean;
}

const SuccessSend = (props: SuccessSendPropsType) => {
  const title = props.isSuccess
    ? 'Your transaction is submitted to the network.'
    : 'An unknown error occurred. Please check the application log for more details.';
  const icon = props.isSuccess ? (
    <SvgIcon icon="approved" color="success" />
  ) : (
    <SvgIcon icon="warning" color="error" />
  );

  const openTx = () => {
    if (props.id) {
      openTxInBrowser(props.networkType, props.id);
    }
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        sx: { p: 3 },
      }}
    >
      <Box display="flex" m={-2} justifyContent="end">
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <StateMessage
        title={props.isSuccess ? 'Success' : 'Failed'}
        description={title}
        color={props.isSuccess ? 'success.dark' : 'error.dark'}
        icon={icon}
      />
      <Divider sx={{ my: 3 }} />
      {props.id ? (
        <DisplayId
          style={{ cursor: 'pointer' }}
          onClick={openTx}
          variant="body2"
          color="textSecondary"
          id={props.id}
        />
      ) : null}
      <Typography variant="body2" sx={{ mt: 3 }}>
        {props.msg}
      </Typography>
      <Box display="flex" mt={2}>
        <Button
          variant="text"
          color="primary"
          fullWidth={false}
          sx={{
            'ml': 'auto',
            'fontSize': '16px',
            'fontWeight': 550,
            'lineHeight': '24px',
            'letterSpacing': '0.6px',
            'textTransform': 'uppercase',
            'padding': 0,
            'minWidth': 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {props.isSuccess ? 'Done' : 'Send via node'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default SuccessSend;
