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
import useExportWallets from '@/hooks/useExportWallets';
import AppFrame from '@/layouts/AppFrame';
import WalletExportItem from '@/pages/export/WalletExportItem';

const WalletExport = () => {
  const {
    selectAll,
    selection,
    selectedCount,
    setSelection,
    setSecret,
    encoded,
  } = useExportWallets();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <AppFrame
      title={`${selectedCount} Selected`}
      navigation={<BackButtonRouter />}
      actions={
        <IconButton
          color={selection.length > selectedCount ? 'default' : 'primary'}
          onClick={selectAll}
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
            handleSecret={(selected: boolean) => setSecret(index, selected)}
            handleSelection={(secret: boolean) => setSelection(index, secret)}
          />
        ))}
      </Stack>
      <Drawer anchor="bottom" open={open} onClose={close}>
        <Box mb={2} display={'flex'}>
          {/*<Box sx={{ flexBasis: 40 }} />*/}
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            Exporting {selectedCount} Wallet{selectedCount > 1 ? 's' : ''}
          </Typography>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Box>
        <DisplayQRCode value={encoded} type={QrCodeTypeEnum.WalletExportJSON} />
        {/*</Box>*/}
      </Drawer>
    </AppFrame>
  );
};

export default WalletExport;
