import { Box, Typography } from '@mui/material';

const Description = () => {
  return (
    <Box sx={{ p: 3, textAlign: 'justify' }}>
      <Typography variant="body1" paragraph sx={{ mt: 3, mb: 3 }}>
        Import multiple wallets from another Minotaur wallet instance. You can
        restore Normal, ReadOnly, and MultiSig wallets by scanning a QR code or
        pasting the exported wallet data.
      </Typography>

      <Typography variant="body2" paragraph>
        The import process will:
      </Typography>

      <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto', mb: 3 }}>
        <Typography variant="body2" component="li" sx={{ mb: 1 }}>
          Detect wallet types automatically
        </Typography>
        <Typography variant="body2" component="li" sx={{ mb: 1 }}>
          Restore addresses and transaction history
        </Typography>
        <Typography variant="body2" component="li" sx={{ mb: 1 }}>
          Preserve MultiSig configurations and signers
        </Typography>
        <Typography variant="body2" component="li" sx={{ mb: 1 }}>
          Check for duplicate wallets to avoid conflicts
        </Typography>
      </Box>
    </Box>
  );
};

export default Description;
