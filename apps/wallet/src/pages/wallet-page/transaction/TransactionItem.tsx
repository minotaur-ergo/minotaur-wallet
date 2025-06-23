import { useNavigate } from 'react-router-dom';

import { StateWallet } from '@minotaur-ergo/types';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';

import { WalletTransactionType } from '@/action/transaction';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import DisplayId from '@/components/display-id/DisplayId';
import { RouteMap, getRoute } from '@/router/routerMap';

// import getChain from '@/utils/networks';
// import openInBrowser from '@/utils/browser';

interface TransactionItemPropsType {
  tx: WalletTransactionType;
  wallet: StateWallet;
}

const TransactionItem = (props: TransactionItemPropsType) => {
  const theme = useTheme();
  const erg_in = props.tx.ergIn;
  const erg_out = props.tx.ergOut;
  const txType = erg_in > erg_out ? 'in' : 'out';
  const amount = txType === 'in' ? erg_in - erg_out : erg_out - erg_in;
  const values =
    txType === 'in'
      ? {
          title: 'Receive',
          sign: '+',
          color: theme.palette.success.main,
        }
      : {
          title: 'Send',
          sign: '-',
          color: theme.palette.error.main,
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
              {values.sign}
              <ErgAmountDisplay amount={amount} /> <small>ERG</small>
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
