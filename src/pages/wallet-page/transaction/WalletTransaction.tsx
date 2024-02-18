import { useEffect, useState } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import {
  getWalletTransactions,
  getWalletTransactionsTotal,
  WalletTransactionType,
} from '@/action/transaction';
import TransactionItem from './TransactionItem';
import AppFrame from '@/layouts/AppFrame';
import { StateWallet } from '@/store/reducer/wallet';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

interface TransactionPropsType {
  wallet: StateWallet;
}

const WalletTransaction = (props: TransactionPropsType) => {
  const [sumOfHeights, setSumOfHeights] = useState(-1n);
  const [transactions, setTransactions] = useState<
    Array<WalletTransactionType>
  >([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [resetTransactions, setResetTransactions] = useState(false);
  // set new total
  useEffect(() => {
    const currentSum = props.wallet.addresses.reduce(
      (a, b) => a + BigInt(b.proceedHeight),
      0n,
    );
    if (!loading && currentSum !== sumOfHeights) {
      setLoading(true);
      getWalletTransactionsTotal(props.wallet.id).then((newTotal) => {
        if (newTotal !== total) {
          setTotal(newTotal);
          setResetTransactions(true);
        }
        setSumOfHeights(currentSum);
        setLoading(false);
      });
    }
  }, [props.wallet.addresses, props.wallet.id, loading, sumOfHeights, total]);
  // load new transactions
  useEffect(() => {
    if (
      !loading &&
      (transactions.length < Math.min(total, limit) || resetTransactions)
    ) {
      setLoading(true);
      if (resetTransactions) {
        getWalletTransactions(props.wallet.id, 0, limit).then(
          (newTransactions) => {
            setTransactions(newTransactions);
            setResetTransactions(false);
            setLoading(false);
          },
        );
      } else {
        getWalletTransactions(
          props.wallet.id,
          transactions.length,
          limit - transactions.length,
        ).then((newTransactions) => {
          setTransactions([...transactions, ...newTransactions]);
          setLoading(false);
        });
      }
    }
  }, [loading, transactions, total, limit, resetTransactions, props.wallet.id]);
  const increaseLimit = () => {
    setLimit(limit + 5);
  };
  return (
    <AppFrame title="WalletTransaction" navigation={<BackButtonRouter />}>
      <Stack divider={<Divider />} spacing={1}>
        {transactions.map((item, index) => (
          <TransactionItem
            tx={item}
            key={index}
            network_type={props.wallet.networkType}
          />
        ))}
      </Stack>
      {total > transactions.length ? (
        <Button variant="outlined" sx={{ my: 2 }} onClick={increaseLimit}>
          Show more
        </Button>
      ) : null}
    </AppFrame>
  );
};

export default WalletTransaction;
