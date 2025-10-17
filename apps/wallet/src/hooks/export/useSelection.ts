import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ExportSelection,
  ExportWallet,
  WalletType,
} from '@minotaur-ergo/types';

const unSelectXPub = (xPub: string, selection: Array<ExportSelection>) => {
  return selection.map((item) => {
    if (
      item.wallet.type === WalletType.MultiSig &&
      item.wallet.signers?.find((item) => item === '+' + xPub)
    ) {
      return { ...item, selected: false };
    }
    return item;
  });
};

const selectXPub = (xPub: string, selection: Array<ExportSelection>) => {
  return selection.map((item) => {
    if (item.wallet.type !== WalletType.MultiSig && item.wallet.xPub === xPub) {
      return { ...item, selected: true };
    }
    return item;
  });
};

const useSelection = (wallets: Array<ExportWallet>) => {
  const [selection, setSelection] = useState<Array<ExportSelection>>([]);
  useEffect(() => {
    setSelection(
      wallets.map((item) => ({ wallet: item, secret: false, selected: false })),
    );
  }, [wallets]);
  const select = useCallback(
    (index: number) => {
      let newSelection = [...selection];
      const isSelected = !newSelection[index].selected;
      newSelection[index] = { ...newSelection[index], selected: isSelected };
      if (
        isSelected &&
        newSelection[index].wallet.type === WalletType.MultiSig
      ) {
        const xPub = newSelection[index].wallet.signers
          ?.find((item) => item.startsWith('+'))
          ?.slice(1);
        if (xPub) {
          newSelection = selectXPub(xPub, newSelection);
        }
      } else if (
        !isSelected &&
        newSelection[index].wallet.type !== WalletType.MultiSig
      ) {
        newSelection = unSelectXPub(
          newSelection[index].wallet.xPub,
          newSelection,
        );
      }
      setSelection(newSelection);
    },
    [selection],
  );
  const selectAll = useCallback(
    (activeSelect: boolean) => {
      setSelection(
        selection.map((item) => ({ ...item, selected: activeSelect })),
      );
    },
    [selection],
  );
  const selectedCount = useMemo(
    () => selection.filter((item) => item.selected).length,
    [selection],
  );
  const changeSecret = useCallback(
    (index: number) => {
      const newSelection = [...selection];
      newSelection[index] = {
        ...newSelection[index],
        secret: !newSelection[index].secret,
      };
      setSelection(newSelection);
    },
    [selection],
  );
  return {
    selection,
    select,
    selectAll,
    selectedCount,
    changeSecret,
  };
};

export { useSelection };
