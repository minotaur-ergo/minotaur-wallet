import { useEffect, useState } from 'react';
import { MultiSigDbAction } from '@/action/db';
import store from '@/store';
import { StateWallet } from '@minotaur-ergo/types';

const useSignerWallet = (wallet: StateWallet) => {
  const [result, setResult] = useState<StateWallet>();
  const [loading, setLoading] = useState(false);
  const [loadedWalletId, setLoadedWalletId] = useState(-1);
  useEffect(() => {
    if (!loading && wallet.id !== loadedWalletId) {
      setLoading(true);
      const loadingWallet = wallet;
      MultiSigDbAction.getInstance()
        .getWalletInternalKey(loadingWallet.id)
        .then((related) => {
          const fetched = store
            .getState()
            .wallet.wallets.filter((item) => item.id === related?.id);
          setResult(fetched.length === 0 ? undefined : fetched[0]);
          setLoadedWalletId(loadingWallet.id);
          setLoading(false);
        });
    }
  }, [loading, wallet, loadedWalletId]);
  return result;
};

export { useSignerWallet };
