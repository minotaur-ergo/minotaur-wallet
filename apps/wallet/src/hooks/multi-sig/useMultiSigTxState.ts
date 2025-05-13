import { useContext, useEffect, useState } from 'react';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { AddressActionRow, MultiSigStateEnum } from '@/types/multi-sig-old';

const useMultiSigTxState = (
  committed: Array<AddressActionRow>,
  signed: Array<AddressActionRow>,
) => {
  const context = useContext(MultiSigContext);
  const [commitCount, setCommitCount] = useState(0);
  const [signCount, setSignCount] = useState(0);
  useEffect(() => {
    setCommitCount(committed.filter((item) => item.completed).length);
  }, [committed]);
  useEffect(() => {
    setSignCount(signed.filter((item) => item.completed).length);
  }, [signed]);
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
