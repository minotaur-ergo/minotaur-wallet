import React, { useRef, useState } from 'react';
import {
  Alert,
  Card,
  CardActionArea,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import BackButton from '../../components/BackButton';
import AppFrame from '../../layouts/AppFrame';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';

const WalletExtendedPublicKey = () => {
  const [type, set_type] = useState<string>('BASE58');
  const snackbar = useRef<SnackAlertHandle>(null);
  const handle_change_type = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    if (newType) set_type(newType);
  };
  const handle_copy = () => {
    snackbar.current?.open();
  };

  return (
    <AppFrame title="Extended public key" navigation={<BackButton />}>
      <Typography>
        Here you can see your wallet extended public key. Using this key you can
        derive all addresses in read-only minotaur wallet.
      </Typography>
      <Alert severity="warning" icon={false} sx={{ my: 2 }}>
        Keep it secret for your privacy.
      </Alert>

      <ToggleButtonGroup
        value={type}
        onChange={handle_change_type}
        exclusive
        color="primary"
      >
        <ToggleButton value="HEX">HEX</ToggleButton>
        <ToggleButton value="BASE58">BASE58</ToggleButton>
        <ToggleButton value="BASE64">BASE64</ToggleButton>
      </ToggleButtonGroup>

      <Card
        elevation={0}
        sx={{ bgcolor: 'white', textAlign: 'center', mt: 1, mb: 2 }}
      >
        <Typography sx={{ p: 8, fontStyle: 'italic', color: 'textSecondary' }}>
          _QR CODE_
        </Typography>
      </Card>
      <Card>
        <CardActionArea
          onClick={handle_copy}
          sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}
        >
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {'6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f'}
          </Typography>
          <IconButton>
            <ContentCopyIcon />
          </IconButton>
        </CardActionArea>
      </Card>
      <SnackAlert
        ref={snackbar}
        message="Extended public key copied successfully!"
      />
    </AppFrame>
  );
};

export default WalletExtendedPublicKey;
