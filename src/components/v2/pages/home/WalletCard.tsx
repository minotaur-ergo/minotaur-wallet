import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { WALLETS } from '../../data';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCartOutlined } from '@mui/icons-material';
import { RouterMap } from '../../V2Demo';
import { getRoute } from '../../../route/routerMap';

const WalletCard = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const wallet = WALLETS.find((row) => row.id === id);

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
          backgroundColor: 'secondary.light',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -220,
            right: -100,
            width: 280,
            height: 280,
            bgcolor: 'secondary.main',
            opacity: 0.25,
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -200,
            left: -100,
            width: 300,
            height: 300,
            bgcolor: 'secondary.main',
            opacity: 0.2,
            borderRadius: '50%',
          }}
        />
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Typography sx={{ fontSize: '2rem', fontWeight: 500 }}>
            {wallet?.amount.toLocaleString()}{' '}
            <Typography
              component="span"
              color="text.secondary"
              style={{ fontSize: '1.4rem' }}
            >
              ERG
            </Typography>
          </Typography>
          <Button
            color="secondary"
            variant="text"
            startIcon={<ShoppingCartOutlined />}
            fullWidth={false}
            sx={{
              borderWidth: 2,
              borderColor: theme.palette.secondary.main,
              borderStyle: 'solid',
              backgroundColor: '#FFFFFF7F',
              lineHeight: '1.5rem',
              fontWeight: 500,
              py: 1,
            }}
            onClick={() => navigate(getRoute(RouterMap.Buy, { id }))}
          >
            BUY
          </Button>
        </Box>
        <Typography color="text.secondary">
          $ {wallet?.value.toLocaleString()}
        </Typography>
        <Box sx={{ height: 56 }} />
        <Button
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '12%',
            color: '#00000066',
            backgroundColor: theme.palette.secondary.main + '66',
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
