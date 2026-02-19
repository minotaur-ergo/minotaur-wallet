import { useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import { Button, Stack } from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import useWalletTransaction from '@/hooks/useWalletTransaction';
import AppFrame from '@/layouts/AppFrame';

import TransactionItem from './TransactionItem';

interface TransactionPropsType {
  wallet: StateWallet;
}

const WalletTransaction = (props: TransactionPropsType) => {
  const [limit, setLimit] = useState(10);
  const { transactions, total } = useWalletTransaction(props.wallet, limit);
  const increaseLimit = () => {
    setLimit(limit + 5);
  };
  return (
    <AppFrame title="WalletTransaction" navigation={<BackButtonRouter />}>
      <Stack spacing={1}>
        {transactions.map((item, index) => (
          <TransactionItem tx={item} key={index} wallet={props.wallet} />
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
