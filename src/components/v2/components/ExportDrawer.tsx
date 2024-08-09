import { Close } from '@mui/icons-material';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import QrCode from './QrCode';

interface PropsType {
  title?: string;
  count: number;
  open: boolean;
  onClose: () => void;
}

export default function ExportDrawer({
  title = 'Item(s)',
  count,
  onClose,
  open,
}: PropsType) {
  return (
    <>
      <Drawer anchor="bottom" open={open} onClose={onClose}>
        <Box display="flex" mb={2}>
          <Box sx={{ flexBasis: 40 }} />
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            Exporting {count} {title}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <QrCode />
      </Drawer>
    </>
  );
}
