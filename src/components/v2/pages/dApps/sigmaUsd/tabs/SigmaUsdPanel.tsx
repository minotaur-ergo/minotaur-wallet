import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
} from '@mui/material';

const SigmaUsdPanel = () => {
  return (
    <Box>
      <Alert severity="info" icon={false} sx={{ mb: 2 }}>
        <Typography gutterBottom>1 ERG = 4.45 SigmaUSD</Typography>
        Circulatory Supply: <strong>{1151844.72}</strong>
      </Alert>

      <Typography variant="h2">Purchase SigmaUSD</Typography>
      <Typography color="textSecondary" sx={{ mb: 2, mt: 1 }}>
        Maximum Available:
        <Typography component="span" color="textPrimary">
          {1249650.3}
        </Typography>
      </Typography>
      <TextField label="Amount" sx={{ mb: 2 }} />
      <Button>Purchase</Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h2">Redeem SigmaUSD</Typography>
      <Typography color="textSecondary" sx={{ mb: 2, mt: 1 }}>
        Maximum Available:
        <Typography component="span" color="textPrimary">
          {0}
        </Typography>
      </Typography>
      <TextField label="Amount" sx={{ mb: 2 }} />
      <Button>Redeem</Button>
    </Box>
  );
};

export default SigmaUsdPanel;
