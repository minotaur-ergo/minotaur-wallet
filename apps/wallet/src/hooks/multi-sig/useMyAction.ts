import { useContext, useEffect, useState } from 'react';

import { AddressCompletionState, MultiSigMyAction } from '@minotaur-ergo/types';

import { TxDataContext } from '@/components/sign/context/TxDataContext';

import { useSignerWallet } from './useSignerWallet';

const useMyAction = (actions: Array<AddressCompletionState>) => {
  const context = useContext(TxDataContext);
  const signer = useSignerWallet(context.wallet);
  const [result, setResult] = useState<MultiSigMyAction>({
    committed: false,
    signed: false,
  });
  useEffect(() => {
    const isCommitted =
      actions.filter(
        (item) =>
          item.address === signer?.addresses[0].address && item.committed,
      ).length > 0;
    const isSigned =
      actions.filter(
        (item) => item.address === signer?.addresses[0].address && item.signed,
      ).length > 0;
    if (isCommitted !== result.committed || isSigned !== result.signed) {
      setResult({ committed: isCommitted, signed: isSigned });
    }
  }, [actions, result, signer]);
  return result;
};

export default useMyAction;
