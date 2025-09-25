import { useCallback, useContext } from 'react';

import { ImportProcessingState } from '@minotaur-ergo/types';
import { CheckCircle, CropSquare, HighlightOff } from '@mui/icons-material';
import { Box, Checkbox, CircularProgress, Typography } from '@mui/material';

import DisplayId from '@/components/display-id/DisplayId';
import { ImportWalletContext } from '@/pages/import/importWalletContext';

interface WalletExportItemProps {
  index: number;
}

const WalletExportItem = (props: WalletExportItemProps) => {
  const context = useContext(ImportWalletContext);
  const wallet = context.data[props.index];
  const getIcon = useCallback(() => {
    switch (wallet.status) {
      case ImportProcessingState.Processing:
        return <CircularProgress size={20} />;
      case ImportProcessingState.Success:
        return <CheckCircle color="success" />;
      case ImportProcessingState.Error:
        return <HighlightOff color="error" />;
      case ImportProcessingState.Pending:
        return <CropSquare />;
    }
    return <div>{wallet.status}</div>;
  }, [wallet.status]);
  return (
    <Box component="label" display="flex" gap={2}>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {context.status === ImportProcessingState.Pending ? (
          <Checkbox
            disabled={wallet.duplicate}
            checked={wallet.selected}
            onChange={() => context.handleSelection(props.index)}
          />
        ) : (
          getIcon()
        )}
      </Box>
      <Box sx={{ p: 2, flexGrow: 10, opacity: wallet.duplicate ? 0.6 : 1 }}>
        <Typography>{wallet.name}</Typography>
        <Typography color="gray">Normal Wallet</Typography>
        <DisplayId
          color="gray"
          id={
            wallet.addresses && wallet.addresses.length > 0
              ? wallet.addresses[0]
              : 'No address'
          }
        />
        {wallet.duplicate ? (
          <Typography color="secondary">Duplicate</Typography>
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
};

export default WalletExportItem;
