import { Star, StarBorder } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import SvgIcon from '@/icons/SvgIcon';
import { ergPriceUsd } from '@/utils/functions';
import { WalletType, WalletTypeLabel } from '@/db/entities/Wallet';
import { RouteMap, getRoute } from '@/router/routerMap';
import { useNavigate } from 'react-router-dom';
import { ConfigDbAction, WalletDbAction } from '@/action/db';
import { ConfigType } from '@/db/entities/Config';
import { GlobalStateType } from '@/store';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import { MAIN_NET_LABEL, WALLET_FLAG_ENUM } from '@/utils/const';
import { MouseEvent } from 'react';

interface PropsType {
  id: string;
  name: string;
  type: WalletType;
  net?: string;
  amount?: bigint;
  tokensCount?: number;
  onClick?: () => unknown;
  archived: boolean;
  favorite: boolean;
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

  const toggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    WalletDbAction.getInstance()
      .setFlagOnWallet(
        parseInt(props.id),
        WALLET_FLAG_ENUM.FAVORITE,
        props.favorite,
      )
      .then(() => null);
  };
  return (
    <Card>
      <CardActionArea
        component={'div'}
        onClick={activateWallet}
        sx={{
          bgcolor: color + '70',
          pb: 2,
          pt: 1,
        }}
      >
        <Box px={2}>
          <Box display="flex" alignItems="start">
            <Typography
              fontSize="1.25rem"
              fontWeight={500}
              lineHeight="1.5rem"
              sx={{ flexGrow: 1, py: 1 }}
            >
              {props.name}
              {props.archived ? <Chip label="Archived" sx={{ ml: 1 }} /> : null}
            </Typography>
            <IconButton onClick={toggleFavorite}>
              {props.favorite ? (
                <Star style={{ color: 'goldenrod' }} />
              ) : (
                <StarBorder />
              )}
            </IconButton>
          </Box>
          {props.tokensCount ? (
            <Typography variant="body2" color="textSecondary">
              {props.tokensCount > 0
                ? `Includes ${props.tokensCount} token${
                    props.tokensCount > 1 ? 's' : ''
                  }`
                : ' '}
            </Typography>
          ) : undefined}
        </Box>

        <Box display="flex" alignItems="end" gap={2} mt={1}>
          <Box
            sx={{
              bgcolor: '#ffffff8f',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              fill: color,
            }}
          >
            <SvgIcon icon="ergo" style={{ width: '1.6rem', fill: 'inherit' }} />
          </Box>
          <Box flexGrow={1}>
            <Typography>
              <ErgAmountDisplay amount={amount} />
              <small>&nbsp;ERG</small>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {props.net === MAIN_NET_LABEL ? (
                ergPriceUsd(amount, ergPrice)
              ) : (
                <span>&nbsp;</span>
              )}
            </Typography>
          </Box>
          <Box mr={2}>
            <Typography
              variant="body2"
              fontSize="small"
              color="textSecondary"
              textAlign="right"
            >
              {props.net}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {WalletTypeLabel[props.type]}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default WalletItem;
