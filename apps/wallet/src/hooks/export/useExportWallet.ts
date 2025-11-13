import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ExportWallet, GlobalStateType } from '@minotaur-ergo/types';

import { toExport } from '@/utils/convert';

const useExportWallet = () => {
  const [result, setResult] = useState<Array<ExportWallet>>([]);
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  useEffect(() => {
    Promise.all(wallets.map((item) => toExport(item, true))).then(setResult);
  }, [wallets]);
  return result;
};

export { useExportWallet };
