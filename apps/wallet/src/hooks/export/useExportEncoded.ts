import { useMemo } from 'react';

import { ExportSelection, WalletType } from '@minotaur-ergo/types';

const useExportEncoded = (wallets: Array<ExportSelection>) => {
  return useMemo(() => {
    return JSON.stringify(
      wallets
        .filter((item) => item.selected)
        .map((item) => {
          if (!item.secret && item.wallet.type === WalletType.Normal)
            return { ...item.wallet, type: WalletType.ReadOnly };
          return item.wallet;
        }),
    );
  }, [wallets]);
};

export { useExportEncoded };
