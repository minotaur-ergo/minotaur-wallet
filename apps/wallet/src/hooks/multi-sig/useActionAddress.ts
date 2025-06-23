import { getTxBoxes } from '@/action/tx';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import {
  AddressCompletionState,
  MultiSigAddressHolder,
  MultiSigDataHintType,
} from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';
import { useContext, useEffect, useState } from 'react';

const useActionAddresses = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressCompletionState> => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const [result, setResult] = useState<Array<AddressCompletionState>>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && data.tx) {
      const newResult: Array<AddressCompletionState> = addresses.map(
        (item) => ({
          address: item.address,
          committed: false,
          signed: false,
        }),
      );
      const boxes = getTxBoxes(data.tx, data.boxes);
      const ergoTrees = data.wallet.addresses.map((item) =>
        wasm.Address.from_base58(item.address).to_ergo_tree().to_base16_bytes(),
      );
      setLoading(true);
      for (let index = 0; index < newResult.length; index++) {
        let committed = true;
        let signed = true;
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
            if (
              hint.Proof === '' ||
              hint.Type === MultiSigDataHintType.SIMULATED
            ) {
              signed = false;
            }
          }
        }
        newResult[index] = {
          ...newResult[index],
          committed: committed,
          signed: signed,
        };
      }
      setResult(newResult);
      setLoading(false);
    }
  }, [addresses, context.hints, data, loading]);
  return result;
};

export default useActionAddresses;
