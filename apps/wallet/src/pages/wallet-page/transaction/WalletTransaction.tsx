import useWalletTransaction from '@/hooks/useWalletTransaction';
import { useState } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import TransactionItem from './TransactionItem';
import AppFrame from '@/layouts/AppFrame';
import { StateWallet } from '@/store/reducer/wallet';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

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
