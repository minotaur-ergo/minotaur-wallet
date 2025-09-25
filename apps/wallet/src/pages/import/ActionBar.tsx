import { useContext } from 'react';

import { ImportProcessingState } from '@minotaur-ergo/types';
import { QrCodeScanner } from '@mui/icons-material';
import { Button } from '@mui/material';

import { ImportWalletContext } from '@/pages/import/importWalletContext';

const ActionBar = () => {
  const context = useContext(ImportWalletContext);
  switch (context.status) {
    case ImportProcessingState.NoData:
      return (
        <Button
          variant="contained"
          startIcon={<QrCodeScanner />}
          onClick={context.scan}
          sx={{ mt: 2 }}
        >
          Scan QR Code
        </Button>
      );
    case ImportProcessingState.Pending:
      return (
        <Button
          variant="contained"
          onClick={context.start}
          disabled={context.selected === 0}
          sx={{ mt: 2 }}
        >
          Import {context.selected} Wallet{context.selected > 1 ? 's' : ''}
        </Button>
      );
  }
};

export default ActionBar;
