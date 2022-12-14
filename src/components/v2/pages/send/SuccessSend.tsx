import React from 'react';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '../../icons/SvgIcon';
import StateMessage from '../../components/StateMessage';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import DisplayId from '../../components/DisplayId';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';

interface PropsType {
  open: boolean;
  handleClose: () => void;
  id: string;
}

export default function ({ open, handleClose, id }: PropsType) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { p: 3 },
      }}
    >
      <Box display="flex" m={-2} justifyContent="end">
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <StateMessage
        title="Success"
        description="Your transaction is generated and submitted to the network."
        color="success.dark"
        icon={<SvgIcon icon="approved" color="success" />}
      />
      <Divider sx={{ my: 3 }} />
      <DisplayId variant="body2" color="textSecondary" id={id} />
      <Typography variant="body2" sx={{ mt: 3 }}>
        It can take about 2 minutes to mine your transaction. Also syncing your
        wallet may be slow.
      </Typography>
    </Dialog>
  );
}
