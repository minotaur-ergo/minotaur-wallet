import { Box, Typography, useTheme } from '@mui/material';
import { WalletTransactionType } from '@/action/transaction';
import { openTxInBrowser } from '@/action/tx';
import DisplayId from '@/components/display-id/DisplayId';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
// import getChain from '@/utils/networks';
// import openInBrowser from '@/utils/browser';

interface TransactionItemPropsType {
  tx: WalletTransactionType;
  network_type: string;
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
  const openTx = () => {
    openTxInBrowser(props.network_type, props.tx.txId);
  };
  return (
    <Box>
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
      <DisplayId
        variant="body2"
        color="textSecondary"
        id={props.tx.txId}
        onClick={openTx}
      />
    </Box>
  );
};

export default TransactionItem;
