import { useNavigate } from 'react-router-dom';

import { MAIN_NET_LABEL, StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';
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
import BalanceDisplay from '@/components/balance-display/BalanceDisplay';
import { WalletTypeLabel } from '@/db/entities/Wallet';
import BalanceChart from '@/pages/wallets/components/BalanceChart';
import { getRoute, RouteMap } from '@/router/routerMap';

interface WalletCardPropsType {
  wallet: StateWallet;
}

const WalletCard = (props: WalletCardPropsType) => {
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
            <BalanceDisplay
              amount={BigInt(props.wallet.balance)}
              tokenBalances={props.wallet.tokens}
              showToggle={true}
            />
          </Typography>
        ) : null}
        <Box sx={{ height: 56 }} />
      </CardContent>
      {props.wallet.networkType === MAIN_NET_LABEL ? (
        <BalanceChart walletId={props.wallet.id} />
      ) : null}
    </Card>
  );
};
export default WalletCard;
