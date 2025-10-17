import { useMemo } from 'react';

import { ExportSelection } from '@minotaur-ergo/types';

const useExportData = (wallets: Array<ExportSelection>) => {
  return useMemo(() => {
    return JSON.stringify(
      wallets.filter((item) => item.selected).map((item) => item.wallet),
    );
  }, [wallets]);
};

export { useExportData };
