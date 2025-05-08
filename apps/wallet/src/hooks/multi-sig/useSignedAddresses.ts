import { useEffect, useState } from 'react';
import { AddressActionRow, MultiSigAddressHolder } from '@/types/multi-sig';

const useSignedAddresses = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressActionRow> => {
  // const context = useContext(MultiSigContext);
  // const data = useContext(TxDataContext);
  const [result, setResult] = useState<Array<AddressActionRow>>([]);
  // const [proceed, setProceed] = useState('');
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(addresses);
    setResult([]);
    // if (!loading && data.tx) {
    // const newSigned = context.data.;
    //   const newAddresses = [...addresses];
    //   if (
    //     JSON.stringify({ signed: newSigned, addresses: newAddresses }) !==
    //     proceed
    //   ) {
    //     setLoading(true);
    //     const newResult: Array<AddressActionRow> = addresses.map((item) => ({
    //       address: item.address,
    //       completed: newSigned.includes(item.address),
    //     }));
    //     setResult(newResult);
    //     setProceed(
    //       JSON.stringify({ signed: newSigned, addresses: newAddresses }),
    //     );
    //     setLoading(false);
    //   }
    // }
  }, [
    addresses,
    // loading,
    // data.tx,
    // data.boxes,
    // data.wallet.addresses,
    // context.data,
    // addresses,
    // proceed,
    // result,
  ]);
  return result;
};

export default useSignedAddresses;
