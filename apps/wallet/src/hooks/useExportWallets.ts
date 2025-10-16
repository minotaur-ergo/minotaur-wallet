import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, StateWallet } from '@minotaur-ergo/types';

import { toExport } from '@/utils/convert';

interface Selection {
  wallet: StateWallet;
  secret: boolean;
  selected: boolean;
}

const useExportWallets = () => {
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const [selection, setSelection] = useState<Array<Selection>>([]);
  const [encoded, setEncoded] = useState('');
  useEffect(() => {
    setSelection(
      wallets.map((item) => ({
        wallet: item,
        secret: false,
        selected: false,
      })),
    );
  }, [wallets]);
  useEffect(() => {
    Promise.all(
      selection
        .filter((item) => item.selected)
        .map((item) => toExport(item.wallet, item.secret)),
    ).then((res) => {
      console.log(res);
      setEncoded(JSON.stringify(res));
    });
  }, [selection]);
  const selectedCount = useMemo(
    () => selection.filter((item) => item.selected).length,
    [selection],
  );

  const selectAll = () => {
    setSelection(
      selection.map((item) => ({
        ...item,
        selected: selectedCount !== wallets.length,
      })),
    );
  };
  const changeSelection = (index: number, selected: boolean) => {
    const newSelection = [...selection];
    newSelection[index] = { ...newSelection[index], selected };
    // const selectedWallet = newSelection[index];
    // if (selectedWallet.wallet.type !== WalletType.MultiSig && !selected) {
    //   newSelection.findIndex((item) => {
    //     if(item.wallet.type === WalletType.MultiSig) {
    //       item.signWalletId === selectedWallet.wallet.id
    //     }
    //     return false
    //   });
    // }
    // if (selectedWallet.wallet.type === WalletType.MultiSig && selected) {
    //   newSelection.forEach((item) => {
    //     if (item.wallet.type === WalletType.MultiSig) {
    //       item.selected = false;
    //     }
    //   });
    // }
    setSelection(newSelection);
  };
  const setSecret = (index: number, secret: boolean) => {
    const newSelection = [...selection];
    newSelection[index] = { ...newSelection[index], secret };
    setSelection(newSelection);
  };
  return {
    selection,
    selectAll,
    selectedCount,
    total: wallets.length,
    setSelection: changeSelection,
    setSecret,
    encoded,
  };
};

export default useExportWallets;
