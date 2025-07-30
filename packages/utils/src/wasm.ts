import { BoxContent, TokenBalanceBigInt } from '@minotaur-ergo/types';
import { createEmptyArrayWithIndex } from '@minotaur/common';
import * as wasm from 'ergo-lib-wasm-browser';

import { ENCODING } from './const';
import { getChain } from './network';

export const serializeBox = (box: wasm.ErgoBox) =>
  Buffer.from(box.sigma_serialize_bytes()).toString(ENCODING);

export const deserializeBox = (boxEncoded: string) =>
  wasm.ErgoBox.sigma_parse_bytes(Buffer.from(boxEncoded, ENCODING));

export const serializeTx = (tx: wasm.ReducedTransaction | wasm.Transaction) => {
  Buffer.from(tx.sigma_serialize_bytes()).toString(ENCODING);
};

export const deserializeTx = (
  txEncoded: string,
  type: 'reduced' | 'signed',
) => {
  if (type === 'reduced') {
    return wasm.ReducedTransaction.sigma_parse_bytes(
      Buffer.from(txEncoded, ENCODING),
    );
  }
  return wasm.Transaction.sigma_parse_bytes(Buffer.from(txEncoded, ENCODING));
};

export const deserializeSignedTx = (txEncoded: string) =>
  deserializeTx(txEncoded, 'signed');
export const deserializeReducedTx = (txEncoded: string) =>
  deserializeTx(txEncoded, 'reduced');

export const boxesToArrayBox = (boxes: wasm.ErgoBoxes): Array<wasm.ErgoBox> => {
  return createEmptyArrayWithIndex(boxes.len()).map((index) =>
    boxes.get(index),
  );
};

export const boxCandidatesToArrayBoxCandidate = (
  boxes: wasm.ErgoBoxCandidates,
): Array<wasm.ErgoBoxCandidate> => {
  return createEmptyArrayWithIndex(boxes.len()).map((index) =>
    boxes.get(index),
  );
};

export const boxArrayToBoxes = (boxes: Array<wasm.ErgoBox>): wasm.ErgoBoxes => {
  const res = wasm.ErgoBoxes.empty();
  boxes.forEach((box) => res.add(box));
  return res;
};

export const isValidAddress = (
  address: string,
  network?: wasm.NetworkPrefix,
) => {
  try {
    const wasmAddress = wasm.Address.from_base58(address);
    if (network) {
      return wasmAddress.to_base58(network) === address;
    }
    return true;
  } catch (exp) {
    return false;
  }
};

export const getBoxTokens = (
  box: wasm.ErgoBox | wasm.ErgoBoxCandidate,
): Array<TokenBalanceBigInt> => {
  const res: Array<TokenBalanceBigInt> = [];
  const tokens = box.tokens();
  for (let index = 0; index < tokens.len(); index++) {
    const token = tokens.get(index);
    const tokenId = token.id().to_str();
    const amount = BigInt(token.amount().as_i64().to_str());
    res.push({ tokenId: tokenId, balance: amount });
  }
  return res;
};

export const boxesToContent = (
  networkType: string,
  boxes: Array<wasm.ErgoBox | wasm.ErgoBoxCandidate>,
): Array<BoxContent> => {
  const chain = getChain(networkType);
  const prefix = chain.prefix;
  return boxes.map((box) => ({
    tokens: getBoxTokens(box),
    amount: BigInt(box.value().as_i64().to_str()),
    address: wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(
      prefix,
    ),
  }));
};
