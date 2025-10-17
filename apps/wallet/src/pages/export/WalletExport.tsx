import { useState } from 'react';

import { QrCodeTypeEnum } from '@minotaur-ergo/types';
import { Checklist, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import { useExportData } from '@/hooks/export/useExportData';
import { useExportWallet } from '@/hooks/export/useExportWallet';
import { useSelection } from '@/hooks/export/useSelection';
import AppFrame from '@/layouts/AppFrame';
import WalletExportItem from '@/pages/export/WalletExportItem';

const WalletExport = () => {
  const wallets = useExportWallet();
  const { selection, select, selectAll, selectedCount, changeSecret } =
    useSelection(wallets);
  const encoded = useExportData(selection);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <AppFrame
      title={`${selectedCount} Selected`}
      navigation={<BackButtonRouter />}
      actions={
        <IconButton
          color={selection.length > selectedCount ? 'default' : 'primary'}
          onClick={() => selectAll(selection.length < selectedCount)}
        >
          <Checklist />
        </IconButton>
      }
      toolbar={
        <Button onClick={() => setOpen(true)} disabled={selectedCount === 0}>
          Export
        </Button>
      }
    >
      <Stack gap={2}>
        {selection.map((item, index) => (
          <WalletExportItem
            key={index}
            {...item}
            handleSecret={() => changeSecret(index)}
            handleSelection={() => select(index)}
          />
        ))}
      </Stack>
      <Drawer anchor="bottom" open={open} onClose={close}>
        <Box mb={2} display={'flex'}>
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            Exporting {selectedCount} Wallet{selectedCount > 1 ? 's' : ''}
          </Typography>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Box>
        <DisplayQRCode value={encoded} type={QrCodeTypeEnum.WalletExportJSON} />
      </Drawer>
    </AppFrame>
  );
};

export default WalletExport;
