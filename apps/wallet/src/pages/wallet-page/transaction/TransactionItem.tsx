import { useNavigate } from 'react-router-dom';

import { StateWallet, WalletTransactionType } from '@minotaur-ergo/types';
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

interface TransactionItemPropsType {
  tx: WalletTransactionType;
  wallet: StateWallet;
  showBalances: boolean;
}

const TransactionItem = (props: TransactionItemPropsType) => {
  const theme = useTheme();
  const erg_in = props.tx.ergIn;
  const erg_out = props.tx.ergOut;
  const txType = erg_in > erg_out ? 'in' : erg_in < erg_out ? 'out' : 'none';
  const amount = txType === 'in' ? erg_in - erg_out : erg_out - erg_in;
  const values =
    txType === 'in'
      ? {
          title: 'Receive',
          sign: '+',
          color: theme.palette.success.main,
        }
      : txType === 'out'
        ? {
            title: 'Send',
            sign: '-',
            color: theme.palette.error.main,
          }
        : {
            title: '--',
            sign: '',
            color: theme.palette.warning.main,
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
    <Card>
      <CardActionArea onClick={openTx}>
        <CardContent>
          <Box display="flex">
            <Typography sx={{ flexGrow: 1 }}>{values.title}</Typography>
            <Typography color={values.color}>
              {props.showBalances ? values.sign : undefined}
              <ErgAmountDisplay
                amount={amount}
                showBalances={props.showBalances}
              />
              {props.showBalances ? <small>ERG</small> : undefined}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {props.tx.date.toLocaleString()}
          </Typography>
          {props.tx.tokens.size > 0 ? (
            <Typography variant="body2" color="textSecondary">
              Includes {props.tx.tokens.size} tokens
            </Typography>
          ) : null}
          <DisplayId variant="body2" color="textSecondary" id={props.tx.txId} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TransactionItem;
