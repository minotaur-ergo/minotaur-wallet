import React, { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import AppFrame from '@/layouts/AppFrame';
import QRCodeSVG from '@/components/display-qrcode/QrCodeSVG';
import base58 from 'bs58';
import { StateWallet } from '@minotaur-ergo/types';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

interface WalletExtendedPublicKeyPropsType {
  wallet: StateWallet;
}

const WalletExtendedPublicKey = (props: WalletExtendedPublicKeyPropsType) => {
  const [type, setType] = useState<string>('BASE58');
  const handleChangeType = (
    _event: React.MouseEvent<HTMLElement>,
    newType: string,
  ) => {
    if (newType) {
      setType(newType);
    }
  };
  const xPub = props.wallet.xPub;
  const xPubEncoded =
    type === 'BASE58'
      ? xPub
      : Buffer.from(base58.decode(xPub)).toString(
          type === 'HEX' ? 'hex' : 'base64',
        );
  return (
    <AppFrame title="Extended public key" navigation={<BackButtonRouter />}>
      <Typography>
        Here you can see your wallet extended public key. Using this key you can
        derive all addresses in read-only minotaur wallet.
      </Typography>
      <Alert severity="warning" icon={false} sx={{ my: 2 }}>
        Keep it secret for your privacy.
      </Alert>

      <ToggleButtonGroup
        value={type}
        onChange={handleChangeType}
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
        <Box sx={{ p: 8, fontStyle: 'italic', color: 'textSecondary' }}>
          <QRCodeSVG value={xPubEncoded} />
        </Box>
      </Card>
      <Card>
        <CardActionArea sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {xPubEncoded}
          </Typography>
          &nbsp;
          <CopyToClipboardIcon text={xPubEncoded} />
        </CardActionArea>
      </Card>
    </AppFrame>
  );
};

export default WalletExtendedPublicKey;
