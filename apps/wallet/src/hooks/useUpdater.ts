import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';

import { syncWallet } from '@/action/sync';
import store from '@/store';
import {
  addUpdatedWallets,
  clearUpdatedWallets,
  forceRefresh,
} from '@/store/reducer/wallet';
import { REFRESH_INTERVAL } from '@/utils/const';

const useUpdater = () => {
  const [loading, setLoading] = useState(true);
  const initialized = useSelector(
    (state: GlobalStateType) => state.wallet.initialized,
  );
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const updatedWallets = useSelector(
    (state: GlobalStateType) => state.wallet.updatedWallets,
  );
  const activeWallet = useSelector(
    (state: GlobalStateType) => state.config.activeWallet,
  );
  const refresh = useSelector((state: GlobalStateType) => state.wallet.refresh);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  // state updates are async, so `loading` alone can let several syncs start
  const syncing = useRef(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 10000);
  }, []);
  useEffect(() => {
    if (!loading && initialized && !syncing.current) {
      syncing.current = true;
      setLoading(true);
      const remaining = wallets
        .filter((item) => updatedWallets.indexOf(item.id) === -1)
        .sort((a, _) => (activeWallet === a.id ? -1 : 0));
      if (remaining.length > 0) {
        const wallet = remaining[0];
        console.log(
          `[sync] start wallet id=${wallet.id} name=${wallet.name} at ${new Date().toISOString()}`,
        );
        syncWallet(wallet)
          .then(() => {
            console.log(`[sync] done wallet id=${wallet.id}`);
            store.dispatch(addUpdatedWallets(wallet.id));
          })
          .catch((e) => {
            console.log(`[sync] failed wallet id=${wallet.id}`, e);
          })
          .finally(() => {
            syncing.current = false;
            setLoading(false);
          });
      } else {
        console.log(
          `Completed syncing process. synced ${updatedWallets.length} wallets`,
        );
        syncing.current = false;
        setLoading(false);
      }
    }
  }, [activeWallet, initialized, loading, updatedWallets, wallets]);
  useEffect(() => {
    if (!loading && refresh) {
      store.dispatch(clearUpdatedWallets());
      if (timer) {
        clearTimeout(timer);
        setTimer(undefined);
      }
    }
  }, [refresh, loading, timer]);
  useEffect(() => {
    if (updatedWallets.length === wallets.length && !timer) {
      const timer = setTimeout(() => {
        store.dispatch(forceRefresh(true));
        setTimer(undefined);
      }, REFRESH_INTERVAL);
      setTimer(timer);
    }
  }, [refresh, updatedWallets, wallets, timer]);
  return { loading };
};

export default useUpdater;
