import { useCallback, useContext, useMemo } from 'react';

import { ImportProcessingState } from '@minotaur-ergo/types';
import {
  CheckCircle,
  CropSquare,
  HighlightOff,
  WarningOutlined,
} from '@mui/icons-material';
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
        return <CircularProgress size={24} />;
      case ImportProcessingState.Success:
        return <CheckCircle color="success" />;
      case ImportProcessingState.Error:
        return <HighlightOff color="error" />;
      case ImportProcessingState.Pending:
        return <CropSquare color="disabled" />;
    }
    return <div>{wallet.status}</div>;
  }, [wallet.status]);
  const disabled = useMemo(() => (wallet.invalid ?? '') !== '', [wallet]);
  return (
    <Box component="label" display="flex" gap={2}>
      <Box sx={{ flexShrink: 0 }}>
        {context.status === ImportProcessingState.Pending ? (
          <Checkbox
            disabled={disabled}
            checked={wallet.selected}
            onChange={() => context.handleSelection(props.index)}
          />
        ) : (
          <Box p={1}>{getIcon()}</Box>
        )}
      </Box>
      <Box sx={{ pt: 1, flexGrow: 1 }}>
        <Box sx={{ opacity: disabled ? 0.6 : 1 }}>
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
        </Box>
        {disabled ? (
          <Box display="flex" color="warning.main" gap={1}>
            <WarningOutlined fontSize="small" />
            <Typography>{wallet.invalid}</Typography>
          </Box>
        ) : undefined}
      </Box>
    </Box>
  );
};

export default WalletExportItem;
