import { useContext, useEffect, useState } from 'react';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { AddressActionRow, MultiSigAddressHolder } from '@/types/multi-sig';

const useCommittedAddress = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressActionRow> => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const [result, setResult] = useState<Array<AddressActionRow>>([]);
  const [proceed, setProceed] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && data.tx) {
      console.log(setResult, setProceed, setLoading);
      // const newCommitments = [...context.data.commitments];
      // const newAddresses = [...addresses];
      // if (
      //   JSON.stringify({
      //     commitments: newCommitments,
      //     addresses: newAddresses,
      //   }) !== proceed
      // ) {
      //   const newResult: Array<AddressActionRow> = newAddresses.map((item) => ({
      //     address: item.address,
      //     completed: false,
      //   }));
      //   const boxes = getTxBoxes(data.tx, data.boxes);
      //   const ergoTrees = data.wallet.addresses.map((item) =>
      //     wasm.Address.from_base58(item.address)
      //       .to_ergo_tree()
      //       .to_base16_bytes(),
      //   );
      //   setLoading(true);
      //   for (let index = 0; index < newResult.length; index++) {
      //     let committed = true;
      //     for (let boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
      //       const box = boxes[boxIndex];
      //       const addressIndex = ergoTrees.indexOf(
      //         box.ergo_tree().to_base16_bytes(),
      //       );
      //       if (addressIndex !== -1 && committed) {
      //         const pubKeys = newAddresses.map(
      //           (item) => item.pubKeys[addressIndex],
      //         );
      //         const myPub = pubKeys[index];
      //         const sortedIndex = [...pubKeys].sort().indexOf(myPub);
      //         if (newCommitments[boxIndex][sortedIndex] === '')
      //           committed = false;
      //       }
      //     }
      //     newResult[index] = { ...newResult[index], completed: committed };
      //   }
      //   setResult(newResult);
      //   setProceed(
      //     JSON.stringify({
      //       commitments: newCommitments,
      //       addresses: newAddresses,
      //     }),
      //   );
      //   setLoading(false);
      // }
    }
  }, [
    loading,
    data.tx,
    data.boxes,
    data.wallet.addresses,
    context.hints,
    addresses,
    proceed,
    result,
  ]);
  return result;
};

export default useCommittedAddress;
