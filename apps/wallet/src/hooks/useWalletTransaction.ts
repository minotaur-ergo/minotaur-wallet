import {
  getWalletTransactions,
  getWalletTransactionsTotal,
  WalletTransactionType,
} from '@/action/transaction';
import { StateWallet } from '@minotaur-ergo/types';
import { useEffect, useState } from 'react';

const useWalletTransaction = (wallet: StateWallet, limit: number) => {
  const [transactions, setTransactions] = useState<
    Array<WalletTransactionType>
  >([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [resetTransactions, setResetTransactions] = useState(false);
  const [heights, setHeights] = useState<string>('');
  useEffect(() => {
    const currentHeights = JSON.stringify(
      wallet.addresses.map((item) => item.proceedHeight),
    );
    if (!loading && currentHeights !== heights) {
      setLoading(true);
      getWalletTransactionsTotal(wallet.id).then((newTotal) => {
        if (newTotal !== total) {
          setTotal(newTotal);
          setResetTransactions(true);
        }
        setHeights(currentHeights);
        setLoading(false);
      });
    }
  }, [wallet.addresses, wallet.id, loading, heights, total]);
  useEffect(() => {
    if (
      !loading &&
      (transactions.length < Math.min(total, limit) || resetTransactions)
    ) {
      setLoading(true);
      getWalletTransactions(
        wallet.id,
        transactions.length,
        limit - transactions.length,
      ).then((newTransactions) => {
        setTransactions([...transactions, ...newTransactions]);
        setResetTransactions(false);
        setLoading(false);
      });
    }
  }, [loading, transactions, total, limit, wallet.id, resetTransactions]);
  return {
    transactions,
    loading,
    total,
  };
};

export default useWalletTransaction;
