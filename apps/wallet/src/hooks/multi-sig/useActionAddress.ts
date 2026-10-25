import { useContext, useMemo } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  AddressCompletionState,
  MultiSigAddressHolder,
  MultiSigHintType,
} from '@minotaur-ergo/types';

import { getTxBoxes } from '@/action/tx';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';

const useActionAddresses = (
  addresses: Array<MultiSigAddressHolder>,
): Array<AddressCompletionState> => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const hints = context.hints;
  const { tx, boxes, wallet } = data;
  // wallet address index of each input box (-1 if not a wallet address).
  // computed once per tx: it needs one wasm call per input box.
  const inputAddressIndexes = useMemo(() => {
    if (!tx) return undefined;
    const ergoTreeIndex = new Map<string, number>();
    wallet.addresses.forEach((item, index) => {
      const ergoTree = wasm.Address.from_base58(item.address)
        .to_ergo_tree()
        .to_base16_bytes();
      if (!ergoTreeIndex.has(ergoTree)) ergoTreeIndex.set(ergoTree, index);
    });
    return getTxBoxes(tx.inputs(), boxes).map(
      (box) => ergoTreeIndex.get(box.ergo_tree().to_base16_bytes()) ?? -1,
    );
  }, [tx, boxes, wallet]);
  return useMemo(() => {
    if (inputAddressIndexes === undefined) return [];
    // position of each signer in the sorted public keys of an address,
    // which is the hint column of that signer for inputs of that address
    const sortedIndexes = new Map<number, Array<number>>();
    const getSortedIndexes = (addressIndex: number) => {
      let res = sortedIndexes.get(addressIndex);
      if (res === undefined) {
        const pubKeys = addresses.map((item) => item.pubKeys[addressIndex]);
        const sorted = [...pubKeys].sort();
        res = pubKeys.map((pubKey) => sorted.indexOf(pubKey));
        sortedIndexes.set(addressIndex, res);
      }
      return res;
    };
    return addresses.map((item, index) => {
      let committed = true;
      let signed = true;
      for (
        let boxIndex = 0;
        boxIndex < inputAddressIndexes.length;
        boxIndex++
      ) {
        const addressIndex = inputAddressIndexes[boxIndex];
        if (addressIndex === -1) continue;
        const hint = hints[boxIndex][getSortedIndexes(addressIndex)[index]];
        if (hint.Commit === '' || hint.Type === MultiSigHintType.Simulated) {
          committed = false;
        }
        if (hint.Proof === '' || hint.Type === MultiSigHintType.Simulated) {
          signed = false;
        }
        // nothing is checked after the first missing commitment
        if (!committed) break;
      }
      return { address: item.address, committed, signed };
    });
  }, [addresses, hints, inputAddressIndexes]);
};

export default useActionAddresses;
