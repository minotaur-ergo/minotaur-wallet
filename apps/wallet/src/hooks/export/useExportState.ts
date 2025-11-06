import { useCallback, useEffect, useState } from 'react';

import { ExportSelection } from '@minotaur-ergo/types';

import { useExportEncoded } from '@/hooks/export/useExportEncoded';
import { useExportWallet } from '@/hooks/export/useExportWallet';
import { useSelection } from '@/hooks/export/useSelection';

const useExportState = () => {
  const [selection, setSelection] = useState<Array<ExportSelection>>([]);
  const wallets = useExportWallet();
  useEffect(() => {
    setSelection(
      wallets.map((item) => ({ wallet: item, secret: false, selected: false })),
    );
  }, [wallets]);
  const { select, selectAll, selectedCount, total } = useSelection(
    selection,
    setSelection,
  );
  const encoded = useExportEncoded(selection);
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
    encoded,
    total,
  };
};

export default useExportState;
