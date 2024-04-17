import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import SvgIcon from '@/icons/SvgIcon';
import { ergPriceUsd } from '@/utils/functions';
import { WalletType, WalletTypeLabel } from '@/db/entities/Wallet';
import { RouteMap, getRoute } from '@/router/routerMap';
import { useNavigate } from 'react-router-dom';
import { ConfigDbAction } from '@/action/db';
import { ConfigType } from '@/db/entities/Config';
import { GlobalStateType } from '@/store';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import { MAIN_NET_LABEL } from '@/utils/const';

interface PropsType {
  id: string;
  name: string;
  type: WalletType;
  net?: string;
  amount?: bigint;
  tokensCount?: number;
  onClick?: () => unknown;
}

const WalletColorMap = {
  [WalletType.Normal]: '#32b14a',
  [WalletType.MultiSig]: '#4a9195',
  // [WalletType.MultiSig]: '#fec844',
  [WalletType.ReadOnly]: '#f1592a',
};

// const COLORS = ['#fec844', '#f1592a', '#32b14a', '#4a9195', '#3c5152'];

const WalletItem = (props: PropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const navigate = useNavigate();
  const amount = props.amount ? props.amount : 0n;
  const color = WalletColorMap[props.type];
  const activateWallet = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      ConfigDbAction.getInstance()
        .setConfig(ConfigType.ActiveWallet, props.id)
        .then(() => {
          navigate(-navigate.length);
          navigate(getRoute(RouteMap.WalletHome, { id: props.id }), {
            replace: true,
          });
        });
    }
  };
  return (
    <Card>
      <CardActionArea
        onClick={activateWallet}
        sx={{ bgcolor: color + '70', display: 'flex' }}
      >
        <Box
          sx={{
            bgcolor: '#ffffff8f',
            p: 1,
            my: 2,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <SvgIcon icon="ergo" style={{ width: '1.6rem', fill: color }} />
        </Box>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Box display="flex" alignItems="baseline">
            <Typography
              sx={{ fontSize: '1.2rem', fontWeight: 500, flexGrow: 1 }}
            >
              {props.name}
            </Typography>
            <Typography>
              <ErgAmountDisplay amount={amount} />
              <small>&nbsp;ERG</small>
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              color="textSecondary"
              sx={{ fontSize: '0.7rem', flexGrow: 1 }}
            >
              {WalletTypeLabel[props.type]} on {props.net}
            </Typography>
            {props.net === MAIN_NET_LABEL ? (
              <Typography sx={{ fontSize: '0.7rem' }} color="textSecondary">
                ${ergPriceUsd(amount, ergPrice)}
              </Typography>
            ) : null}
          </Box>
          {props.tokensCount && props.tokensCount > 0 ? (
          <Typography variant="body2" color="textSecondary">
              Includes {props.tokensCount} token{props.tokensCount > 1 ? 's' : ''}
          </Typography>
          ) : null}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default WalletItem;
