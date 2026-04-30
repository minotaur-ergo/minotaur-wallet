import { useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import { ContentPasteOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import AppFrame from '@/layouts/AppFrame';
import { readClipBoard } from '@/utils/clipboard';

interface MultiSigCommunicationPropsType {
  wallet: StateWallet;
}

const MultiSigRegisterServer = (_props: MultiSigCommunicationPropsType) => {
  const [url, setUrl] = useState<string>('');

  const pasteAction = async () => {
    try {
      readClipBoard().then((res) => {
        setUrl((old) => old + res);
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AppFrame
      title="Multi-sig Registeration"
      navigation={<BackButtonRouter />}
      toolbar={
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 1,
            py: 1.2,
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: '0.48px',
          }}
        >
          REGISTER
        </Button>
      }
    >
      <Stack spacing={3} mt={1}>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 16, fontWeight: 400, lineHeight: '1.45' }}
        >
          To register the multi-sig communication, enter the server URL:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: '#FFF',
            px: 2,
            py: 1.1,
          }}
        >
          <InputBase
            fullWidth
            placeholder="URL"
            inputProps={{ 'aria-label': 'url' }}
            sx={{ fontSize: 16, fontWeight: 400, lineHeight: '32px' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <IconButton size="small" onClick={pasteAction}>
            <ContentPasteOutlined />
          </IconButton>
        </Box>
      </Stack>
    </AppFrame>
  );
};

export default MultiSigRegisterServer;
