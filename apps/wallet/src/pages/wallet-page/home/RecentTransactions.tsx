import useWalletTransaction from '@/hooks/useWalletTransaction';
import { Box, Stack } from '@mui/material';
import StateMessage from '@/components/state-message/StateMessage';
import SvgIcon from '@/icons/SvgIcon';
import TransactionItem from '../transaction/TransactionItem';
import Heading from '@/components/heading/Heading';
import { getRoute, RouteMap } from '@/router/routerMap';
import LoadingPage from '@/components/loading-page/LoadingPage';
import { StateWallet } from '@/store/reducer/wallet';

interface RecentTransactionsPropsType {
  wallet: StateWallet;
}

const RecentTransactions = (props: RecentTransactionsPropsType) => {
  const { transactions, loading } = useWalletTransaction(props.wallet, 5);
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
        <Stack spacing={1}>
          {transactions.map((item, index) => (
            <TransactionItem tx={item} key={index} wallet={props.wallet} />
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
