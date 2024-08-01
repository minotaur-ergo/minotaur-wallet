import { Box, IconButton, Stack } from '@mui/material';
import qr from '../sample-qr.png';
import { ContentCopy, Download } from '@mui/icons-material';

export default function QrCode() {
  return (
    <>
      <Box sx={{ mx: 'auto' }}>
        <img src={qr} />
      </Box>
      <Stack direction="row" justifyContent="center">
        <IconButton>
          <ContentCopy />
        </IconButton>
        <IconButton>
          <Download />
        </IconButton>
      </Stack>
    </>
  );
}
