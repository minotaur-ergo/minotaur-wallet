import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DisplayId from '../../components/DisplayId';

export default function ({ type, amount, date, id }: any) {
  const theme = useTheme();
  const values =
    type === 'in'
      ? {
          title: 'Receive',
          sign: '+',
          color: theme.palette.success.main,
        }
      : {
          title: 'Send',
          sign: '-',
          color: theme.palette.error.main,
        };
  const formatDate = (date: number | string): string => {
    const d = new Date(date);
    return d.toLocaleString();
  };
  return (
    <Box>
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{values.title}</Typography>
        <Typography color={values.color}>
          {values.sign}
          {amount.toFixed(2)} <small>ERG</small>
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {formatDate(date)}
      </Typography>
      <DisplayId variant="body2" color="textSecondary" id={id} />
    </Box>
  );
}
