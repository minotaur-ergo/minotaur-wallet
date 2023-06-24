import React, { useRef } from 'react';
import {
  Alert,
  Box,
  CardActionArea,
  IconButton,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SnackAlert, { SnackAlertHandle } from './SnackAlert';

interface PropsType {
  address: string;
  title?: string;
}

export default function ({ title = 'Address', address }: PropsType) {
  const alert = useRef<SnackAlertHandle>(null);

  const handle_copy = () => {
    navigator.clipboard.writeText(address).then(
      () => {
        alert.current?.set(`${title} copied to clipboard!`, 'success');
        alert.current?.open();
      },
      () => {
        alert.current?.set(
          `${title} failed to copy to the clipboard!`,
          'error'
        );
        alert.current?.open();
      }
    );
  };

  return (
    <CardActionArea onClick={handle_copy}>
      <Alert severity="info" icon={false}>
        <Box display="flex">
          <Typography sx={{ overflowWrap: 'anywhere' }}>{address}</Typography>
          <IconButton color="inherit">
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Alert>
      <SnackAlert ref={alert} />
    </CardActionArea>
  );
}
