import React, { useCallback, useMemo, useState } from 'react';

import useImportProcess from '@/pages/import/hooks/useImportProcess';
import useImportProgress from '@/pages/import/hooks/useImportProgress';
import useProcessingState from '@/pages/import/hooks/useProcessingState';

import { ImportWalletContext } from './importWalletContext';

interface ImportWalletContextHandler {
  children: React.ReactNode;
}

const ImportWalletContextHandler = (props: ImportWalletContextHandler) => {
  const [index, setIndex] = useState(-1);
  const { data, setData, scan } = useImportProcess();
  const selected = useMemo(
    () => data.filter((item) => item.selected).length,
    [data],
  );
  const start = useCallback(() => {
    if (index === -1) setIndex(0);
  }, [index]);
  const handleSelection = useCallback(
    (index: number) => {
      const newWallets = [...data];
      newWallets[index] = {
        ...newWallets[index],
        selected: !newWallets[index].selected,
      };
      setData(newWallets);
    },
    [data, setData],
  );
  const status = useProcessingState(data);
  useImportProgress(data, setData, index, setIndex);
  console.log(index, data);
  return (
    <ImportWalletContext.Provider
      value={{
        data,
        status,
        scan,
        start,
        selected,
        handleSelection,
      }}
    >
      {props.children}
    </ImportWalletContext.Provider>
  );
};

export default ImportWalletContextHandler;
