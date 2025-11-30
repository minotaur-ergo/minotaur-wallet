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
import WalletItem from '@/components/export-import/WalletItem';
import useExportState from '@/hooks/export/useExportState';
import AppFrame from '@/layouts/AppFrame';

const WalletExport = () => {
  const {
    selection,
    select,
    selectAll,
    selectedCount,
    changeSecret,
    encoded,
    total,
  } = useExportState();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <AppFrame
      title={`Export Wallets`}
      navigation={<BackButtonRouter />}
      actions={
        <IconButton
          color={total > selectedCount ? 'default' : 'primary'}
          onClick={() => selectAll(total > selectedCount)}
        >
          <Checklist />
        </IconButton>
      }
      toolbar={
        <Button onClick={() => setOpen(true)} disabled={selectedCount === 0}>
          Export {selectedCount} Wallet{selectedCount > 1 ? 's' : ''}
        </Button>
      }
    >
      <Stack gap={2}>
        {selection.map((item, index) => (
          <WalletItem
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
