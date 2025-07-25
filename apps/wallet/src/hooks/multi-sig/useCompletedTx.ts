import { useContext, useEffect } from 'react';

import { MultiSigStateEnum } from '@minotaur-ergo/types';

import { signCompleted } from '@/action/multi-sig/sign';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';

export const useCompletedTx = () => {
  const context = useContext(MultiSigContext);
  const contextData = useContext(TxDataContext);
  const multiDataContext = useContext(MultiSigDataContext);
  const signed = context.signed;
  const signer = useSignerWallet(contextData.wallet);
  const unsigned = contextData.tx;
  const reduced = contextData.reduced;
  useEffect(() => {
    if (multiDataContext.state === MultiSigStateEnum.COMPLETED) {
      if (unsigned && reduced && signer) {
        if (
          signed === undefined ||
          signed.id().to_str() !== unsigned.id().to_str()
        ) {
          signCompleted(
            contextData.wallet,
            signer,
            context.hints,
            reduced,
            contextData.boxes,
          ).then((res) => {
            context.setSigned(res);
          });
        }
      }
    }
  }, [
    context,
    context.signed,
    contextData.boxes,
    contextData.wallet,
    multiDataContext.state,
    reduced,
    signed,
    signer,
    unsigned,
  ]);
};
