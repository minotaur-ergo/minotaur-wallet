import { useContext, useEffect, useState } from 'react';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { useSignerWallet } from './useSignerWallet';
import { AddressActionRow, MyAction } from '@/types/multi-sig';

const useMyAction = (
  committed: Array<AddressActionRow>,
  signed: Array<AddressActionRow>,
) => {
  const context = useContext(TxDataContext);
  const signer = useSignerWallet(context.wallet);
  const [result, setResult] = useState<MyAction>({
    committed: false,
    signed: false,
  });
  useEffect(() => {
    const isCommitted =
      committed.filter(
        (item) =>
          item.address === signer?.addresses[0].address && item.completed,
      ).length > 0;
    const isSigned =
      signed.filter(
        (item) =>
          item.address === signer?.addresses[0].address && item.completed,
      ).length > 0;
    if (isCommitted !== result.committed || isSigned !== result.signed) {
      setResult({ committed: isCommitted, signed: isSigned });
    }
  }, [committed, signed, result, signer]);
  return result;
};

export default useMyAction;
