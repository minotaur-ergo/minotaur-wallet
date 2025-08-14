import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GlobalStateType, StateWallet } from '@minotaur-ergo/types';
import { ergPriceUsd, getChain, MAIN_NET_LABEL } from '@minotaur-ergo/utils';
import { ShoppingCartOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import { WalletTypeLabel } from '@/db/entities/Wallet';
import { getRoute, RouteMap } from '@/router/routerMap';

interface WalletCardPropsType {
  wallet: StateWallet;
}

const WalletCard = (props: WalletCardPropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const navigate = useNavigate();
  const gotoBuy = () => {
    navigate(getRoute(RouteMap.WalletBuy, { id: props.wallet.id }));
  };
  const theme = useTheme();
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
              {getChain(props.wallet.networkType).label}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {WalletTypeLabel[props.wallet.type]}
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
            <ErgAmountDisplay amount={BigInt(props.wallet.balance)} />
            <Typography
              component="span"
              color="text.secondary"
              style={{ fontSize: '1.4rem' }}
            >
              ERG
            </Typography>
          </Typography>
          {props.wallet.networkType === MAIN_NET_LABEL ? (
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
              onClick={gotoBuy}
            >
              BUY
            </Button>
          ) : undefined}
        </Box>
        {props.wallet.networkType === MAIN_NET_LABEL ? (
          <Typography color="text.secondary">
            $ {ergPriceUsd(BigInt(props.wallet.balance), ergPrice)}
          </Typography>
        ) : null}
        <Box sx={{ height: 56 }} />
        {/*<Button*/}
        {/*  sx={{*/}
        {/*    position: 'absolute',*/}
        {/*    right: 0,*/}
        {/*    bottom: '12%',*/}
        {/*    color: '#00000066',*/}
        {/*    backgroundColor: theme.palette.secondary.main + '66',*/}
        {/*    borderBottomLeftRadius: 20,*/}
        {/*    borderTopLeftRadius: 20,*/}
        {/*    borderBottomRightRadius: 0,*/}
        {/*    borderTopRightRadius: 0,*/}
        {/*    p: 1*/}
        {/*  }}*/}
        {/*  // startIcon={<ArrowDropDownIcon />}*/}
        {/*  variant="text"*/}
        {/*  fullWidth={false}*/}
        {/*>*/}
        {/*  Mon.*/}
        {/*</Button>*/}
      </CardContent>
    </Card>
  );
};
export default WalletCard;
