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
        color: result < 0n ? 'error.main' : 'success.main',
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {result < 0n ? (
        <TrendingDownIcon sx={iconSx} />
      ) : (
        <TrendingUpIcon sx={iconSx} />
      )}
      <Typography
        component="span"
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: 'inherit',
        }}
      >
        <BalanceDisplay
          amount={result < 0n ? -result : result}
          tokenBalances={[]}
        />
      </Typography>
    </Box>
  );
};

export default TransactionResult;
