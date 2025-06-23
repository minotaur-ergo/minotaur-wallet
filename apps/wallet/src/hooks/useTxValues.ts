import { useEffect, useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { extractErgAndTokenSpent } from '@/action/tx';

interface Values {
  total: bigint;
  txId: string;
  tokens: { [tokenId: string]: bigint };
}

const useTxValues = (
  tx: wasm.Transaction | wasm.UnsignedTransaction | undefined,
  boxes: Array<wasm.ErgoBox>,
  wallet: StateWallet,
) => {
  const [txValues, setTxValues] = useState<Values>({
    total: 0n,
    txId: '',
    tokens: {},
  });
  const [valuesDirection, setValuesDirection] = useState({
    incoming: false,
    outgoing: false,
  });
  useEffect(() => {
    const unsigned = tx;
    if (unsigned && txValues.txId !== unsigned.id().to_str()) {
      const values = extractErgAndTokenSpent(wallet, boxes, unsigned);
      const incoming =
        values.value < 0n ||
        Object.values(values.tokens).filter((amount) => amount < 0n).length > 0;
      const outgoing =
        values.value > 0n ||
        Object.values(values.tokens).filter((amount) => amount > 0n).length > 0;
      setValuesDirection({ incoming, outgoing });
      setTxValues({
        total: values.value,
        tokens: values.tokens,
        txId: unsigned.id().to_str(),
      });
    }
  }, [txValues.txId, tx, wallet, boxes]);
  return {
    txValues,
    valuesDirection,
  };
};

export default useTxValues;
