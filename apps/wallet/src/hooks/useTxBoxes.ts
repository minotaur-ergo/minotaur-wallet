import { useEffect, useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { BoxContent, StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';

import {
  boxesToJsonMap,
  createAddressResolver,
  JsonBox,
  jsonBoxToContent,
  txToJson,
} from '@/utils/eip12';

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
        // convert to json once to avoid wasm calls per input and token
        const jsonTx = txToJson(unsigned);
        const jsonBoxes = boxesToJsonMap(boxes);
        const getAddress = createAddressResolver(
          getChain(wallet.networkType).prefix,
        );
        setInputBoxes(
          jsonTx.inputs
            .map((input) => jsonBoxes.get(input.boxId))
            .filter((box): box is JsonBox => box !== undefined)
            .map((box) => jsonBoxToContent(box, getAddress)),
        );
        setOutputBoxes(
          jsonTx.outputs.map((box) => jsonBoxToContent(box, getAddress)),
        );
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
