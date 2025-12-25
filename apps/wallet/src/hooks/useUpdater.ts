import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
import { MAIN_NET_LABEL, TEST_NET_LABEL } from '@minotaur-ergo/utils';

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
  const {
    activeWallet,
    mainnetExplorerUrl,
    testnetExplorerUrl,
    mainnetSyncWithNode,
    testnetSyncWithNode,
    mainnetNodeAddress,
    testnetNodeAddress,
  } = useSelector((state: GlobalStateType) => state.config);
  const refresh = useSelector((state: GlobalStateType) => state.wallet.refresh);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();

  useEffect(() => {
    setTimeout(() => setLoading(false), 10000);
  }, []);

  useEffect(() => {
    if (!loading && initialized) {
      setLoading(true);
      const filtered = wallets.filter(
        (item) => updatedWallets.indexOf(item.id) === -1,
      );
      const filteredActive = filtered.filter(
        (item) => item.id !== activeWallet,
      );
      const wallet =
        filteredActive.length === 0 ? filtered[0] : filteredActive[0];
      if (wallet) {
        syncWallet(
          wallet,
          // explorer url
          wallet.networkType === MAIN_NET_LABEL
            ? mainnetExplorerUrl
            : testnetExplorerUrl,
          // sync with node?
          (wallet.networkType === MAIN_NET_LABEL && mainnetSyncWithNode) ||
            (wallet.networkType === TEST_NET_LABEL && testnetSyncWithNode),
          // node url
          wallet.networkType === MAIN_NET_LABEL
            ? mainnetNodeAddress
            : testnetNodeAddress,
        )
          .then(() => {
            store.dispatch(addUpdatedWallets(wallet.id));
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        console.log(
          `Completed syncing process. synced ${updatedWallets.length} wallets`,
        );
        setLoading(false);
      }
    }
  }, [
    activeWallet,
    loading,
    initialized,
    wallets,
    updatedWallets,
    mainnetExplorerUrl,
    testnetExplorerUrl,
    mainnetSyncWithNode,
    testnetSyncWithNode,
    mainnetNodeAddress,
    testnetNodeAddress,
  ]);
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
