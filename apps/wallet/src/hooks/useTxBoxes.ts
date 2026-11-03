import { useMemo } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { BoxContent, StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';

import { createAddressResolver } from '@/utils/eip12';

interface TxBoxesReader {
  inputCount: number;
  outputCount: number;
  getInput: (index: number) => BoxContent | undefined;
  getOutput: (index: number) => BoxContent;
}

const boxToContent = (
  box: wasm.ErgoBox | wasm.ErgoBoxCandidate,
  getAddress: (ergoTree: string) => string,
): BoxContent => {
  const tokens = box.tokens();
  const balances = [];
  for (let index = 0; index < tokens.len(); index++) {
    const token = tokens.get(index);
    balances.push({
      tokenId: token.id().to_str(),
      balance: BigInt(token.amount().as_i64().to_str()),
    });
  }
  return {
    address: getAddress(box.ergo_tree().to_base16_bytes()),
    amount: BigInt(box.value().as_i64().to_str()),
    tokens: balances,
  };
};

/**
 * Gives indexed access to the input and output boxes of a transaction.
 *
 * A transaction can have thousands of boxes, so a box is converted only when it
 * is requested (e.g. when a virtualized list renders its row) and then cached.
 */
const useTxBoxes = (
  wallet: StateWallet,
  boxes: Array<wasm.ErgoBox>,
  tx?: wasm.Transaction | wasm.UnsignedTransaction,
): TxBoxesReader => {
  const networkType = wallet.networkType;
  return useMemo(() => {
    if (!tx) {
      return {
        inputCount: 0,
        outputCount: 0,
        getInput: () => undefined,
        getOutput: () => {
          throw Error('transaction is not loaded');
        },
      };
    }
    const getAddress = createAddressResolver(getChain(networkType).prefix);
    const inputs = tx.inputs();
    const outputs = tx.output_candidates();
    const inputCache = new Map<number, BoxContent | undefined>();
    const outputCache = new Map<number, BoxContent>();
    let boxMap: Map<string, wasm.ErgoBox> | undefined;
    const findInputBox = (index: number) => {
      const boxId = inputs.get(index).box_id().to_str();
      // boxes are usually stored in input order, so avoid building the map
      const sameIndexBox = boxes[index];
      if (sameIndexBox && sameIndexBox.box_id().to_str() === boxId) {
        return sameIndexBox;
      }
      if (!boxMap) {
        boxMap = new Map(boxes.map((box) => [box.box_id().to_str(), box]));
      }
      return boxMap.get(boxId);
    };
    return {
      inputCount: inputs.len(),
      outputCount: outputs.len(),
      getInput: (index: number) => {
        if (!inputCache.has(index)) {
          const box = findInputBox(index);
          inputCache.set(
            index,
            box ? boxToContent(box, getAddress) : undefined,
          );
        }
        return inputCache.get(index);
      },
      getOutput: (index: number) => {
        let content = outputCache.get(index);
        if (content === undefined) {
          content = boxToContent(outputs.get(index), getAddress);
          outputCache.set(index, content);
        }
        return content;
      },
    };
  }, [tx, boxes, networkType]);
};

export type { TxBoxesReader };
export default useTxBoxes;
