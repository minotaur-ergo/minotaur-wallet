import { useContext } from 'react';

import { QrCodeScanner } from '@mui/icons-material';
import { Button } from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import AppFrame from '@/layouts/AppFrame';

import Description from './Description';

const WalletImport = () => {
  const context = useContext(QrCodeContext);
  return (
    <AppFrame
      title="Import Wallets"
      navigation={<BackButtonRouter />}
      toolbar={
        <Button
          variant="contained"
          startIcon={<QrCodeScanner />}
          onClick={context.start}
          sx={{ mt: 2 }}
        >
          Scan QR Code
        </Button>
      }
    >
      <Description />
    </AppFrame>
  );
};

export default WalletImport;
