import { useContext, useEffect, useState } from 'react';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { AddressActionRow, MultiSigAddressHolder } from '@/types/multi-sig-old';

const useSignedAddresses = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressActionRow> => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const [result, setResult] = useState<Array<AddressActionRow>>([]);
  const [proceed, setProceed] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && data.tx) {
      const newSigned = context.data.signed;
      const newAddresses = [...addresses];
      if (
        JSON.stringify({ signed: newSigned, addresses: newAddresses }) !==
        proceed
      ) {
        setLoading(true);
        const newResult: Array<AddressActionRow> = addresses.map((item) => ({
          address: item.address,
          completed: newSigned.includes(item.address),
        }));
        setResult(newResult);
        setProceed(
          JSON.stringify({ signed: newSigned, addresses: newAddresses }),
        );
        setLoading(false);
      }
    }
  }, [
    loading,
    data.tx,
    data.boxes,
    data.wallet.addresses,
    context.data,
    addresses,
    proceed,
    result,
  ]);
  return result;
};

export default useSignedAddresses;
