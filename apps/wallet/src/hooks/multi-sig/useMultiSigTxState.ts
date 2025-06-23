import { useContext, useEffect, useState } from 'react';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import {
  AddressCompletionState,
  MultiSigStateEnum,
} from '@minotaur-ergo/types';

const useMultiSigTxState = (actions: Array<AddressCompletionState>) => {
  const context = useContext(MultiSigContext);
  const [commitCount, setCommitCount] = useState(0);
  const [signCount, setSignCount] = useState(0);
  useEffect(() => {
    setCommitCount(actions.filter((item) => item.committed).length);
  }, [actions]);
  useEffect(() => {
    setSignCount(actions.filter((item) => item.signed).length);
  }, [actions]);
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
