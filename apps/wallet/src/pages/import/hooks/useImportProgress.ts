import { useCallback, useEffect, useState } from 'react';

import {
  ImportProcessingState,
  RestoreWalletWithSelection,
} from '@minotaur-ergo/types';

import { importWallet } from '@/utils/import';

const useImportProgress = (
  data: Array<RestoreWalletWithSelection>,
  setData: (data: Array<RestoreWalletWithSelection>) => unknown,
  index: number,
  setIndex: (index: number) => unknown,
) => {
  const [loading, setLoading] = useState(false);
  const convertStatus = useCallback(
    (status: ImportProcessingState) => {
      setData(
        data.map((item, itemIndex) => {
          if (index === itemIndex) return { ...item, status };
          return item;
        }),
      );
    },
    [data, setData, index],
  );
  useEffect(() => {
    if (index >= 0 && index < data.length && !loading) {
      const currentWallet = data[index];
      console.log(currentWallet.selected, currentWallet);
      if (currentWallet.selected) {
        setLoading(true);
        convertStatus(ImportProcessingState.Processing);

        importWallet(currentWallet)
          .then(() => {
            convertStatus(ImportProcessingState.Success);
            setIndex(index + 1);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Import failed:', error);
            convertStatus(ImportProcessingState.Error);
            setIndex(index + 1);
            setLoading(false);
          });
      } else {
        setIndex(index + 1);
      }
    }
  }, [index, data, setIndex, setData, loading]);
  return null;
};

export default useImportProgress;
