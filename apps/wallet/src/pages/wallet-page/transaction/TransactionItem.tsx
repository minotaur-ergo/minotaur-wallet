import { useNavigate } from 'react-router-dom';

import {
  StateWallet,
  TxStatus,
  WalletTransactionType,
} from '@minotaur-ergo/types';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import DisplayId from '@/components/display-id/DisplayId';
import { getRoute, RouteMap } from '@/router/routerMap';

import TransactionResult from './TransactionResult';

interface TransactionItemPropsType {
  tx: WalletTransactionType;
  wallet: StateWallet;
}

const formatTransactionDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${getPart('day')} ${getPart('month')} ${getPart('year')}, ${getPart('hour')}:${getPart('minute')}:${getPart('second')} ${getPart('dayPeriod')}`;
};

const TransactionItem = (props: TransactionItemPropsType) => {
  const theme = useTheme();
  const erg_in = props.tx.ergIn;
  const erg_out = props.tx.ergOut;
  const txType =
    erg_in > erg_out
      ? TxStatus.IN
      : erg_in < erg_out
        ? TxStatus.OUT
        : TxStatus.NONE;
  const amount = txType === TxStatus.IN ? erg_in - erg_out : erg_out - erg_in;
  const values =
    txType === TxStatus.IN
      ? {
          title: 'Receive',
          color: theme.palette.success.main,
          bgColor: '#DEEDE5',
          textColor: theme.palette.success.main,
        }
      : txType === TxStatus.OUT
        ? {
            title: 'Send',
            color: theme.palette.error.main,
            bgColor: '#F0DBDB',
            textColor: theme.palette.error.main,
          }
        : {
            title: '--',
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light,
            textColor: theme.palette.warning.main,
          };
  const navigate = useNavigate();
  const openTx = () => {
    navigate(
      getRoute(RouteMap.WalletTransactionDetail, {
        txId: props.tx.txId,
        id: `${props.wallet.id}`,
      }),
    );
  };
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={openTx} sx={{ borderRadius: 'inherit' }}>
        <CardContent
          sx={{
            'px': 1.5,
            'py': 1.25,
            '&:last-child': { pb: 1.25 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                flexGrow: 1,
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.16px',
              }}
            >
              {formatTransactionDate(props.tx.date)}
            </Typography>

            {props.tx.tokens.size > 0 ? (
              <Box
                sx={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: '16px',
                  letterSpacing: '0.16px',
                  whiteSpace: 'nowrap',
                }}
              >
                {props.tx.tokens.size}{' '}
                {props.tx.tokens.size === 1 ? 'Token' : 'Tokens'}
              </Box>
            ) : null}

            <Box
              sx={{
                padding: '4px 8px',
                borderRadius: '4px',
                bgcolor: values.bgColor,
                color: values.textColor,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: '16px',
                letterSpacing: '0.16px',
                whiteSpace: 'nowrap',
              }}
            >
              {values.title}
            </Box>
          </Box>

          <Typography
            sx={{
              color: values.color,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: '25px',
              letterSpacing: '0.16px',
            }}
          >
            <ErgAmountDisplay amount={amount} /> <small>ERG</small>
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <DisplayId
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '0.16px',
                }}
                id={props.tx.txId}
              />
            </Box>

            <TransactionResult tx={props.tx} amount={amount} txType={txType} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TransactionItem;
