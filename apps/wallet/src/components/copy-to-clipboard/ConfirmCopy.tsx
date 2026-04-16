import CopyToClipboardImpl from 'react-copy-to-clipboard';

import { Button, Stack, SwipeableDrawer, Typography } from '@mui/material';

type ConfirmCopyProps = {
  open: boolean;
  textToCopy?: string;
  confirmMessage: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmCopy = (props: ConfirmCopyProps) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={props.open}
      onClose={props.onClose}
      onOpen={() => {}}
      PaperProps={{
        sx: {
          pt: 3,
          pb: 1,
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 18,
          lineHeight: '20px',
          letterSpacing: '0.16px',
          mb: 4,
        }}
      >
        Security Warning
      </Typography>

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.16px',
          mb: 2,
        }}
      >
        {props.confirmMessage}
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button
          variant="text"
          fullWidth={false}
          onClick={props.onClose}
          sx={{
            fontWeight: 500,
            fontSize: 16,
            color: 'text.secondary',
            lineHeight: '24px',
            letterSpacing: '0.16px',
          }}
        >
          Cancel
        </Button>
        <CopyToClipboardImpl
          text={props.textToCopy || ''}
          onCopy={props.onConfirm}
        >
          <Button
            variant="text"
            fullWidth={false}
            sx={{
              fontWeight: 500,
              fontSize: 16,
              color: 'warning.main',
              lineHeight: '24px',
              letterSpacing: '0.16px',
            }}
          >
            Copy Anyway
          </Button>
        </CopyToClipboardImpl>
      </Stack>
    </SwipeableDrawer>
  );
};

export default ConfirmCopy;
