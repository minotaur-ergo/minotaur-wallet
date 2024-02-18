import { useEffect, useState } from 'react';
import { WalletDbAction } from '@/action/db';
import { syncWallet } from '@/action/sync';
import { REFRESH_INTERVAL } from '@/utils/const';
import { useSelector } from 'react-redux';
import { GlobalStateType } from '@/store';

const useUpdater = () => {
  const [loading, setLoading] = useState(false);
  const initialized = useSelector(
    (state: GlobalStateType) => state.wallet.initialized,
  );
  useEffect(() => {
    if (!loading && initialized) {
      setLoading(true);
      WalletDbAction.getInstance()
        .getWallets()
        .then(async (wallets) => {
          for (const wallet of wallets) {
            try {
              await syncWallet(wallet);
            } catch (exp) {
              console.log(exp);
            }
          }
          setTimeout(() => setLoading(false), REFRESH_INTERVAL);
        });
    }
  }, [loading, initialized]);
  return { loading };
};

export default useUpdater;
