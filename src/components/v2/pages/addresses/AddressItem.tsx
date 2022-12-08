import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import DisplayId from '../../components/DisplayId';

interface PropsType {
  name?: string;
  amount?: number;
  id?: string;
}

export default function ({ name = '', amount = 0, id = '' }: PropsType) {
  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
        <Typography>
          {amount.toFixed(2)} <small>ERG</small>
        </Typography>
      </Box>
      <DisplayId variant="body2" color="textSecondary" id={id} />
    </Card>
  );
}
