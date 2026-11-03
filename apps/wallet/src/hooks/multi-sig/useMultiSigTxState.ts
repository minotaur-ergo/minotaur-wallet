import { useContext, useMemo } from 'react';

import {
  AddressCompletionState,
  MultiSigStateEnum,
} from '@minotaur-ergo/types';

import { MultiSigContext } from '@/components/sign/context/MultiSigContext';

const useMultiSigTxState = (actions: Array<AddressCompletionState>) => {
  const context = useContext(MultiSigContext);
  // derived in render (not in an effect) so the state always matches actions
  const commitCount = useMemo(
    () => actions.filter((item) => item.committed).length,
    [actions],
  );
  const signCount = useMemo(
    () => actions.filter((item) => item.signed).length,
    [actions],
  );
  if (signCount >= context.requiredSign)
    return { state: MultiSigStateEnum.COMPLETED, last: false };
  if (commitCount < context.requiredSign) {
    return {
      state: MultiSigStateEnum.COMMITMENT,
      last: commitCount === context.requiredSign - 1,
    };
  }
  return {
    state: MultiSigStateEnum.SIGNING,
    last: signCount === context.requiredSign - 1,
  };
};

export { MultiSigStateEnum, useMultiSigTxState };
