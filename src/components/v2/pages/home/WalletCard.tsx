import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { WALLETS } from '../../data';
import { useParams } from 'react-router-dom';

const WalletCard = () => {
  const { id } = useParams();
  const wallet = WALLETS.find((row) => row.id === id);
  const color = {
    light: '#fffcb5',
    main: '#d7d02a',
  };
  return (
    <Card
      sx={{
        mb: 3,
        mx: -1,
        position: 'relative',
        zIndex: 1,
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
          backgroundColor: color.light,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <circle cx={100} cy={0} r={50} fill={color.main} opacity={0.2} />
          <circle cx={0} cy={130} r={80} fill={color.main} opacity={0.1} />
        </svg>
      </Box>
      <CardContent>
        <Box display="flex" alignItems="end">
          <Box flexGrow={1}>
            <Typography variant="body2" color="textSecondary">
              Current Balance
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {wallet?.net}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {wallet?.type}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '2rem' }}>
          {wallet?.amount.toFixed(2)}{' '}
          <span style={{ fontSize: '1.4rem' }}>ERG</span>
        </Typography>
        <Typography>$ {wallet?.value.toFixed(2)}</Typography>
        <Box sx={{ height: 56 }} />
        <Button
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '12%',
            color: '#00000066',
            backgroundColor: color.main + '66',
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            p: 1,
          }}
          startIcon={<ArrowDropDownIcon />}
          variant="text"
          fullWidth={false}
        >
          Mon.
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
