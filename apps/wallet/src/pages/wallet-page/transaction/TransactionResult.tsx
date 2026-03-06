import { TxStatus, WalletTransactionType } from '@minotaur-ergo/types';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Typography } from '@mui/material';

import BalanceDisplay from '@/components/balance-display/BalanceDisplay';
import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';

interface TransactionResultPropsType {
  tx: WalletTransactionType;
  amount: bigint;
  txType: TxStatus;
  withBg?: boolean;
  forceDisplay?: boolean;
}

const TransactionResult = (props: TransactionResultPropsType) => {
  const tokenList = Array.from(props.tx.tokens.entries()).map(
    ([tokenId, balance]) => ({ tokenId, balance }),
  );

  const totalTokensInErg = useTokensTotalInErg(tokenList);

  const result =
    totalTokensInErg + props.amount * (props.txType === TxStatus.IN ? 1n : -1n);

  const iconSx = { fontSize: 16 };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.4,
        borderRadius: props.withBg ? '4px' : 0,
        p: props.withBg ? '4px' : 0,
        color: result < 0n ? 'error.main' : 'success.main',
        fontWeight: 700,
        flexShrink: 0,
      }}
      bgcolor={
        props.withBg ? (result < 0n ? '#F0DBDB' : '#D4F0D4') : 'transparent'
      }
    >
      {result < 0n ? (
        <TrendingDownIcon sx={iconSx} />
      ) : (
        <TrendingUpIcon sx={iconSx} />
      )}
      <Typography
        component="span"
        ml={0.5}
        sx={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '16px',
          letterSpacing: '0.16px',
          color: 'inherit',
        }}
      >
        <BalanceDisplay
          amount={result < 0n ? -result : result}
          tokenBalances={[]}
          forceDisplay={props.forceDisplay}
        />
      </Typography>
    </Box>
  );
};

export default TransactionResult;
