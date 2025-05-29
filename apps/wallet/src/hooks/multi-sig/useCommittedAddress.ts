import { getTxBoxes } from '@/action/tx';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { AddressActionRow, MultiSigAddressHolder } from '@/types/multi-sig';
import { MultiSigDataHintType } from '@/types/multi-sig/hint';
import * as wasm from 'ergo-lib-wasm-browser';
import { useContext, useEffect, useState } from 'react';

const useCommittedAddress = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressActionRow> => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const [result, setResult] = useState<Array<AddressActionRow>>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && data.tx) {
      const newResult: Array<AddressActionRow> = addresses.map((item) => ({
        address: item.address,
        completed: false,
      }));
      const boxes = getTxBoxes(data.tx, data.boxes);
      const ergoTrees = data.wallet.addresses.map((item) =>
        wasm.Address.from_base58(item.address).to_ergo_tree().to_base16_bytes(),
      );
      setLoading(true);
      for (let index = 0; index < newResult.length; index++) {
        let committed = true;
        for (let boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
          const box = boxes[boxIndex];
          const addressIndex = ergoTrees.indexOf(
            box.ergo_tree().to_base16_bytes(),
          );
          if (addressIndex !== -1 && committed) {
            const pubKeys = addresses.map((item) => item.pubKeys[addressIndex]);
            const myPub = pubKeys[index];
            const sortedIndex = [...pubKeys].sort().indexOf(myPub);
            const hint = context.hints[boxIndex][sortedIndex];
            if (
              hint.Commit === '' ||
              hint.Type === MultiSigDataHintType.SIMULATED
            ) {
              committed = false;
            }
          }
        }
        newResult[index] = { ...newResult[index], completed: committed };
      }
      setResult(newResult);
      setLoading(false);
    }
  }, [addresses, context.hints, data, loading]);
  return result;
};

export default useCommittedAddress;
