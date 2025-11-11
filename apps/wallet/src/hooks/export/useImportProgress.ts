import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ImportProcessingState,
  RestoreWalletWithSelection,
  WalletType,
} from '@minotaur-ergo/types';

import store from '@/store';
import { invalidateWallets } from '@/store/reducer/wallet';
import { importWallet } from '@/utils/import';

const useImportProgress = (
  data: Array<RestoreWalletWithSelection>,
  setData: (data: Array<RestoreWalletWithSelection>) => unknown,
  index: number,
  setIndex: (index: number) => unknown,
) => {
  const [loading, setLoading] = useState(false);
  const currentIndex = useMemo(() => {
    if (
      index >= 0 &&
      index < data.length &&
      data[index].wallet.type === WalletType.MultiSig
    ) {
      const relatedIndex = data.findIndex(
        (item) =>
          data[index].wallet.signers?.includes('+' + item.wallet.xPub) &&
          item.wallet.type !== WalletType.MultiSig,
      );
      if (
        data[relatedIndex].selected &&
        data[relatedIndex].status === ImportProcessingState.Pending
      ) {
        return relatedIndex;
      }
    }
    return index;
  }, [index, data]);
  const convertStatus = useCallback(
    (status: ImportProcessingState) => {
      setData(
        data.map((item, itemIndex) => {
          if (currentIndex === itemIndex) return { ...item, status };
          return item;
        }),
      );
    },
    [data, setData, currentIndex],
  );
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < data.length && !loading) {
      const currentWallet = data[currentIndex];
      if (
        currentWallet.selected &&
        currentWallet.status === ImportProcessingState.Pending
      ) {
        setLoading(true);
        convertStatus(ImportProcessingState.Processing);

        importWallet(currentWallet)
          .then(() => {
            convertStatus(ImportProcessingState.Success);
            if (currentIndex === index) setIndex(index + 1);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Import failed:', error);
            convertStatus(ImportProcessingState.Error);
            if (currentIndex === index) setIndex(index + 1);
            setLoading(false);
          });
      } else {
        setIndex(index + 1);
      }
    }
  }, [currentIndex, index, data, setIndex, setData, loading, convertStatus]);
  useEffect(() => {
    if (currentIndex === data.length) {
      store.dispatch(invalidateWallets());
    }
  }, [currentIndex, data.length]);
  return null;
};

export default useImportProgress;
