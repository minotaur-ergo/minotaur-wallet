import { useEffect, useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { BoxContent } from '@/types/sign-modal';
import { boxesToContent, createEmptyArrayWithIndex } from '@/utils/functions';

const useTxBoxes = (
  wallet: StateWallet,
  boxes: Array<wasm.ErgoBox>,
  tx?: wasm.Transaction | wasm.UnsignedTransaction,
) => {
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputBoxes, setInputBoxes] = useState<Array<BoxContent>>([]);
  const [outputBoxes, setOutputBoxes] = useState<Array<BoxContent>>([]);
  const [walletId, setWalletId] = useState(-1);
  useEffect(() => {
    if (tx && !loading) {
      const unsigned = tx;
      if (unsigned.id().to_str() !== txId || walletId !== wallet.id) {
        setLoading(true);
        const processingWalletId = wallet.id;
        const inputsWasm = unsigned.inputs();
        const inputs = createEmptyArrayWithIndex(inputsWasm.len()).map(
          (index) => {
            const input = inputsWasm.get(index);
            const box = boxes.filter(
              (item) => item.box_id().to_str() === input.box_id().to_str(),
            );
            if (box.length !== 0) {
              return box[0];
            }
            return box[index];
          },
        );
        setInputBoxes(boxesToContent(wallet.networkType, inputs));
        const outputCandidates = unsigned.output_candidates();
        const outputs = createEmptyArrayWithIndex(outputCandidates.len()).map(
          (index) => outputCandidates.get(index),
        );
        setOutputBoxes(boxesToContent(wallet.networkType, outputs));
        setTxId(unsigned.id().to_str());
        setWalletId(processingWalletId);
        setLoading(false);
      }
    }
  }, [tx, loading, txId, walletId, wallet, boxes]);
  return {
    inputBoxes,
    outputBoxes,
  };
};

export default useTxBoxes;
