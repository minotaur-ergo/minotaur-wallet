import Dialog from '@mui/material/Dialog';
import { openTxInBrowser } from '../../../action/tx';
import SvgIcon from '../../../icons/SvgIcon';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    : 'Failed to send transaction';
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
        title={props.isSuccess ? 'Success' : 'Error'}
        description={title}
        color={props.isSuccess ? 'success.dark' : 'error.dark'}
        icon={icon}
      />
      <Divider sx={{ my: 3 }} />
      {props.id ? (
        <DisplayId
          onClick={openTx}
          variant="body2"
          color="textSecondary"
          id={props.id}
        />
      ) : null}
      <Typography variant="body2" sx={{ mt: 3 }}>
        {props.msg}
      </Typography>
    </Dialog>
  );
};

export default SuccessSend;
