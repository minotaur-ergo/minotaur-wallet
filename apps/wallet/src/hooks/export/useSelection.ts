import { useCallback, useMemo } from 'react';

import { ExportWallet, WalletType } from '@minotaur-ergo/types';

interface SelectionType {
  wallet: ExportWallet;
  selected: boolean;
}
const unSelectXPub = <T extends SelectionType>(
  xPub: string,
  selection: Array<T>,
): Array<T> => {
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

const selectXPub = <T extends SelectionType>(
  xPub: string,
  selection: Array<T>,
): Array<T> => {
  return selection.map((item) => {
    if (item.wallet.type !== WalletType.MultiSig && item.wallet.xPub === xPub) {
      return { ...item, selected: true };
    }
    return item;
  });
};

const useSelection = <T extends SelectionType>(
  selection: Array<T>,
  setSelection: (wallets: Array<T>) => unknown,
  valid?: (row: T) => boolean,
) => {
  const isRowValid = useCallback(
    (row: T) => {
      if (valid) return valid(row);
      return true;
    },
    [valid],
  );
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
    [selection, setSelection],
  );
  const selectAll = useCallback(
    (activeSelect: boolean) => {
      setSelection(
        selection.map((item) => {
          return isRowValid(item) ? { ...item, selected: activeSelect } : item;
        }),
      );
    },
    [selection, setSelection, isRowValid],
  );
  const total = useMemo(() => {
    return selection.filter(isRowValid).length;
  }, [selection, isRowValid]);
  const selectedCount = useMemo(
    () => selection.filter((item) => item.selected).length,
    [selection],
  );
  return {
    select,
    selectAll,
    selectedCount,
    total,
  };
};

export { useSelection };
