import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const WalletCard = () => {
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
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="body2" color="textSecondary">
              Current Balance
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>
              34.2 <small>ERG</small>
            </Typography>
            <Typography>$ 91.245</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              MAIN-NET
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              Normal Wallet
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 80 }} />
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
