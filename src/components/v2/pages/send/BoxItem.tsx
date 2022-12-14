import React from 'react';
import { Box, Typography } from '@mui/material';
import DisplayId from '../../components/DisplayId';

interface PropsType {
  amount?: number;
  id?: string;
}

export default function ({ amount = 0, id = '' }: PropsType) {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 8,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor: 'primary.light',
        }}
      />
      <Box sx={{ overflow: 'auto' }}>
        <DisplayId variant="body2" color="textSecondary" id={id} />
        <Typography>
          {amount.toFixed(2)} <small>ERG</small>
        </Typography>
      </Box>
    </Box>
  );
}
