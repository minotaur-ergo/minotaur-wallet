import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

const TotalBalanceCard = () => {
  const theme = useTheme();
  const value = 'calculating';
  const rate = 1.02;

  return (
    <Card
      sx={{
        mb: 3,
        position: 'relative',
        backgroundColor: 'transparent',
      }}
      elevation={3}
    >
      <Box
        sx={{
          position: 'absolute',
          zIndex: -1,
          width: '100%',
          height: '100%',
          backgroundColor: theme.palette.primary.light,
        }}
      >
        <svg viewBox="0 0 100 100" style={{ width: '100%' }}>
          <circle
            cx={10}
            cy={-25}
            r={40}
            stroke={theme.palette.primary.main}
            strokeWidth={6}
            fill="none"
            opacity={0.3}
          />
          <circle
            cx={100}
            cy={30}
            r={30}
            stroke={theme.palette.primary.main}
            strokeWidth={6}
            fill="none"
            opacity={0.5}
          />
          <circle
            cx={80}
            cy={80}
            r={50}
            stroke={theme.palette.primary.main}
            strokeWidth={6}
            fill="none"
            opacity={0.3}
          />
        </svg>
      </Box>
      <CardContent>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: '#ffffffcc' }}
        >
          Total Balance
        </Typography>
        <Typography
          textAlign="center"
          fontWeight={600}
          sx={{ color: '#fff', fontSize: '2rem', my: 1 }}
        >
          $ {value.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: '#ffffffcc' }}
        >
          <Typography
            color={rate > 0 ? 'success.light' : 'error.light'}
            variant="body2"
            component="span"
          >
            {rate > 0 ? '+' : '-'}
            {Math.abs(rate)}%{' '}
          </Typography>
          from last week
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TotalBalanceCard;
