import { useMemo } from 'react';

import {
  ImportProcessingState,
  RestoreWalletWithSelection,
} from '@minotaur-ergo/types';

const useProcessingState = (data: Array<RestoreWalletWithSelection>) => {
  return useMemo(() => {
    if (data.length === 0) return ImportProcessingState.NoData;

    const hasProcessing = data.some(
      (item) => item.status === ImportProcessingState.Processing,
    );
    if (hasProcessing) return ImportProcessingState.Processing;

    const hasError = data.some(
      (item) => item.status === ImportProcessingState.Error,
    );
    if (hasError) return ImportProcessingState.Error;

    const allSuccess = data.some(
      (item) => item.status === ImportProcessingState.Success,
    );
    if (allSuccess) return ImportProcessingState.Success;

    return ImportProcessingState.Pending;
  }, [data]);
};

export default useProcessingState;
