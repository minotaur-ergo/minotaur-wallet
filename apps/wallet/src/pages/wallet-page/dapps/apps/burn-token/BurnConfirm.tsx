import { Box, Button, Stack, SwipeableDrawer, Typography } from '@mui/material';

import BalanceDisplay from '@/components/balance-display/BalanceDisplay';

type BurnConfirmSheetProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  value: bigint;
};

export function BurnConfirmSheet(props: BurnConfirmSheetProps) {
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
        Burn Confirmation
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
        Are you sure you want to burn these tokens? You will permanently destroy
        assets with a current value of{' '}
        <Box component="span" sx={{ fontWeight: 700 }}>
          <BalanceDisplay amount={props.value} tokenBalances={[]} />
        </Box>
        .
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button
          variant="text"
          fullWidth={false}
          onClick={props.onClose}
          sx={{
            fontWeight: 500,
            fontSize: 18,
            color: 'text.secondary',
            lineHeight: '24px',
            letterSpacing: '0.16px',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="text"
          fullWidth={false}
          onClick={props.onConfirm}
          sx={{
            fontWeight: 500,
            fontSize: 18,
            color: 'error.main',
            lineHeight: '24px',
            letterSpacing: '0.16px',
          }}
        >
          Confirm
        </Button>
      </Stack>
    </SwipeableDrawer>
  );
}
