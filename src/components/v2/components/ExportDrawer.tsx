import { Close, ContentCopy, Download } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import SquareButton from './SquareButton';
import QrCode from './QrCode';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useState } from 'react';

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
  const [openSettings, setOpenSettings] = useState(false);
  const [qrPagesCount, setQrPagesCount] = useState<number>(2);
  const [value, setValue] = useState<number>(qrPagesCount);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };
  const handleOpenSettings = () => {
    setOpenSettings(true);
  };
  const handleCancel = () => {
    setValue(qrPagesCount);
    setOpenSettings(false);
  };
  const handleConfirm = () => {
    setQrPagesCount(value);
    setOpenSettings(false);
  };

  return (
    <>
      <Drawer anchor="bottom" open={open && !openSettings} onClose={onClose}>
        <Box display="flex" mb={2}>
          <Box sx={{ flexBasis: 40 }} />
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            Exporting {count} {title}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <QrCode pagesCount={qrPagesCount} />
        <Divider sx={{ mb: 2, mx: -3 }} />
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
              label="Settings"
              icon={<QrCodeIcon />}
              color="success.main"
              onClick={handleOpenSettings}
            />
          </Grid>
        </Grid>
      </Drawer>

      <Drawer anchor="bottom" open={openSettings}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          QR Code Settings
        </Typography>
        <Typography>Number of Pages: {value}</Typography>
        <Slider
          value={value}
          min={1}
          step={1}
          max={10}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="non-linear-slider"
        />
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handleConfirm}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
