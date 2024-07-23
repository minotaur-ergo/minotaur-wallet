import { Close, ContentCopy, Download, QrCode } from '@mui/icons-material';
import { Box, Drawer, Grid, IconButton, Typography } from '@mui/material';
import SquareButton from './SquareButton';

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
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <SquareButton label="Download" icon={<Download />} />
        </Grid>
        <Grid item xs={4}>
          <SquareButton
            label="Copy"
            icon={<ContentCopy />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={4}>
          <SquareButton
            label="QR Code"
            icon={<QrCode />}
            color="success.main"
          />
        </Grid>
      </Grid>
    </Drawer>
  );
}
