import { useEffect, useState } from 'react';
import { Box, Divider, Stack } from '@mui/material';
import StateMessage from '@/components/state-message/StateMessage';
import SvgIcon from '@/icons/SvgIcon';
import TransactionItem from '../transaction/TransactionItem';
import Heading from '@/components/heading/Heading';
import { getRoute, RouteMap } from '@/router/routerMap';
import LoadingPage from '@/components/loading-page/LoadingPage';
import { StateWallet } from '@/store/reducer/wallet';
import {
  getWalletTransactions,
  WalletTransactionType,
} from '@/action/transaction';

interface RecentTransactionsPropsType {
  wallet: StateWallet;
}

const RecentTransactions = (props: RecentTransactionsPropsType) => {
  const [sumOfHeights, setSumOfHeights] = useState(-1n);
  const [transactions, setTransactions] = useState<
    Array<WalletTransactionType>
  >([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const currentSum = props.wallet.addresses.reduce(
      (a, b) => a + BigInt(b.proceedHeight),
      0n,
    );
    if (currentSum !== sumOfHeights && !loading) {
      setLoading(true);
      getWalletTransactions(props.wallet.id, 0, 5).then((res) => {
        setTransactions(res);
        setSumOfHeights(currentSum);
        setLoading(false);
      });
    }
  }, [props.wallet.addresses, props.wallet.id, sumOfHeights, loading]);
  return (
    <Box sx={{ mb: 2 }}>
      <Heading
        title="Recent Wallet Transaction"
        actionLabel="View all"
        actionPath={getRoute(RouteMap.WalletTransaction, {
          id: props.wallet.id,
        })}
        disabled={transactions.length === 0}
      />
      {transactions.length > 0 ? (
        <Stack divider={<Divider />} spacing={1}>
          {transactions.map((item, index) => (
            <TransactionItem
              tx={item}
              key={index}
              network_type={props.wallet.networkType}
            />
          ))}
        </Stack>
      ) : loading ? (
        <LoadingPage />
      ) : (
        <Box p={3}>
          <StateMessage
            title="No record"
            description="You have not any transactions yet!"
            icon={<SvgIcon icon="document" />}
          />
        </Box>
      )}
    </Box>
  );
};

export default RecentTransactions;
