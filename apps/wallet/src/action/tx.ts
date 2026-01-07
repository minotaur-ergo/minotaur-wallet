import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  ReceiverType,
  StateWallet,
  TokenBalanceBigInt,
  TotalSpent,
} from '@minotaur-ergo/types';
import { getBoxTokens, getChain } from '@minotaur-ergo/utils';

import openInBrowser from '@/utils/browser';

import { deserialize } from './box';
import { BoxDbAction } from './db';
import { getProver } from './wallet';

const newEmptyReceiver = () => ({ address: '', amount: 0n, tokens: [] });

const receiverTokensToDict = (tokens: Array<TokenBalanceBigInt>) => {
  const res: { [tokenId: string]: bigint } = {};
  tokens.forEach((token) => {
    if (Object.keys(res).indexOf(token.tokenId) === -1) {
      res[token.tokenId] = token.balance;
    } else {
      res[token.tokenId] += token.balance;
    }
  });
  return res;
};

const selectBoxes = async (
  amount: bigint,
  tokens: Array<TokenBalanceBigInt>,
  addresses: Array<number>,
) => {
  const minBoxValue = -BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str());
  const requiredTokens = receiverTokensToDict(tokens);
  const result: Array<wasm.ErgoBox> = [];
  const selectBox = (box: wasm.ErgoBox) => {
    result.push(box);
    getBoxTokens(box).forEach((token) => {
      if (Object.keys(requiredTokens).indexOf(token.tokenId) !== -1) {
        requiredTokens[token.tokenId] -= token.balance;
        if (requiredTokens[token.tokenId] <= 0n) {
          delete requiredTokens[token.tokenId];
        }
      }
    });
    amount -= BigInt(box.value().as_i64().to_str());
  };
  for (const boxEntity of await BoxDbAction.getInstance().getAddressBoxes(
    addresses,
  )) {
    if (boxEntity.spend_tx_id !== null) continue;
    const box = deserialize(boxEntity.serialized);
    if (amount > 0 || (amount < 0 && amount > minBoxValue)) {
      selectBox(box);
    } else {
      const boxTokens = getBoxTokens(box);
      for (const token of boxTokens) {
        if (Object.keys(requiredTokens).indexOf(token.tokenId) !== -1) {
          selectBox(box);
        }
      }
    }
    if (
      (amount === 0n || amount < minBoxValue) &&
      Object.keys(requiredTokens).length === 0
    ) {
      break;
    }
  }
  const coveringMsg: Array<string> = [];
  Object.entries(requiredTokens).forEach(([tokenId, amount]) => {
    coveringMsg.push(`${tokenId.substring(0, 6)}... : ${amount.toString()}`);
  });
  return {
    boxes: result,
    covered: amount <= 0n && Object.keys(requiredTokens).length === 0,
    covering: coveringMsg,
  };
};

const generateCandidates = (height: number, receivers: Array<ReceiverType>) =>
  receivers.map((receiver) => {
    const builder = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(receiver.amount.toString())),
      wasm.Contract.pay_to_address(wasm.Address.from_base58(receiver.address)),
      height,
    );
    receiver.tokens.forEach((token) => {
      if (token.balance > 0n) {
        builder.add_token(
          wasm.TokenId.from_str(token.tokenId),
          wasm.TokenAmount.from_i64(
            wasm.I64.from_str(token.balance.toString()),
          ),
        );
      }
    });
    if (receiver.registers) {
      Object.entries(receiver.registers).forEach(([key, value]) => {
        builder.set_register_value(parseInt(key), value);
      });
    }
    return builder.build();
  });

export const generateChangeBox = (
  inputs: Array<wasm.ErgoBox>,
  outputs: Array<wasm.ErgoBoxCandidate>,
  fee: bigint,
  address: string,
  height: number,
) => {
  let total = inputs
    .map((item) => BigInt(item.value().as_i64().to_str()))
    .reduce((a, b) => a + b, 0n);
  total -= outputs
    .map((item) => BigInt(item.value().as_i64().to_str()))
    .reduce((a, b) => a + b, 0n);
  total -= fee;
  const tokens = receiverTokensToDict(
    inputs
      .map((input) => getBoxTokens(input))
      .reduce((a, b) => [...a, ...b], []),
  );
  outputs.forEach((output) => {
    getBoxTokens(output).forEach((token) => {
      if (Object.keys(tokens).indexOf(token.tokenId) !== -1) {
        tokens[token.tokenId] -= token.balance;
        if (tokens[token.tokenId] <= 0n) {
          delete tokens[token.tokenId];
        }
      }
    });
  });
  if (total === 0n && Object.keys(tokens).length === 0) return undefined;
  const builder = new wasm.ErgoBoxCandidateBuilder(
    wasm.BoxValue.from_i64(wasm.I64.from_str(total.toString())),
    wasm.Contract.pay_to_address(wasm.Address.from_base58(address)),
    height,
  );
  Object.entries(tokens).forEach(([tokenId, amount]) => {
    builder.add_token(
      wasm.TokenId.from_str(tokenId),
      wasm.TokenAmount.from_i64(wasm.I64.from_str(amount.toString())),
    );
  });
  return builder.build();
};

const generateTx = async (
  wallet: StateWallet,
  addresses: Array<number>,
  receivers: Array<ReceiverType>,
  fee: bigint,
) => {
  const boxes = await selectBoxes(
    receivers.map((item) => item.amount).reduce((a, b) => a + b, fee),
    receivers.map((item) => item.tokens).reduce((a, b) => [...a, ...b], []),
    addresses,
  );
  if (!boxes.covered) {
    // TODO must display required send-amount
    throw Error('Not enough erg or tokens: ' + boxes.covering.join(', '));
  }
  const selectedBoxes = boxes.boxes;
  const chain = getChain(wallet.networkType);
  const network = chain.getExplorerNetwork();
  const height = await network.getHeight();
  const candidates = generateCandidates(height, receivers);
  const selectedAddresses = wallet.addresses
    .filter((item) => addresses.includes(item.id))
    .sort((a, b) => {
      return a.isDefault === b.isDefault ? a.idx - b.idx : a.isDefault ? -1 : 1;
    });
  const changeBox = generateChangeBox(
    selectedBoxes,
    candidates,
    fee,
    selectedAddresses[0].address,
    height,
  );
  const inputBoxes = wasm.ErgoBoxes.empty();
  selectedBoxes.forEach((item) => inputBoxes.add(item));
  const boxSelection = new wasm.BoxSelection(
    inputBoxes,
    new wasm.ErgoBoxAssetsDataList(),
  );
  const candidateBoxes = wasm.ErgoBoxCandidates.empty();
  candidates.forEach((box) => candidateBoxes.add(box));
  if (changeBox) candidateBoxes.add(changeBox);
  const tx = wasm.TxBuilder.new(
    boxSelection,
    candidateBoxes,
    height,
    wasm.BoxValue.from_i64(wasm.I64.from_str(fee.toString())),
    wasm.Address.from_base58(wallet.addresses[0].address),
  ).build();
  // const reduced = wasm.ReducedTransaction.from_unsigned_tx(tx, inputBoxes, wasm.ErgoBoxes.empty(), await network.getContext())
  return { tx, boxes: selectedBoxes };
};

const getReduced = async (
  networkType: string,
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
  dataBoxes: Array<wasm.ErgoBox> = [],
  forceNode: boolean,
) => {
  const chain = getChain(networkType);
  const context = forceNode
    ? await chain.getNodeNetwork().getContext()
    : await chain.getExplorerNetwork().getContext();
  const inputBoxes = wasm.ErgoBoxes.empty();
  const dataInputBoxes = wasm.ErgoBoxes.empty();
  boxes.forEach((box) => inputBoxes.add(box));
  dataBoxes.forEach((box) => dataInputBoxes.add(box));
  return wasm.ReducedTransaction.from_unsigned_tx(
    tx,
    inputBoxes,
    dataInputBoxes,
    context,
  );
};

const extractErgAndTokenSpent = (
  wallet: StateWallet,
  boxes: Array<wasm.ErgoBox>,
  tx: wasm.Transaction | wasm.UnsignedTransaction,
): TotalSpent => {
  const addresses = wallet.addresses.map((item) => item.address);
  const prefix = getChain(wallet.networkType).prefix;
  const getBoxAddress = (box: wasm.ErgoBox | wasm.ErgoBoxCandidate) => {
    return wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(
      prefix,
    );
  };
  let totalErg = 0n;
  let tokens: Array<TokenBalanceBigInt> = [];
  const inputs = tx.inputs();
  for (let index = 0; index < inputs.len(); index++) {
    const boxId = inputs.get(index).box_id().to_str();
    const filteredBoxes = boxes.filter(
      (item) =>
        item.box_id().to_str() === boxId &&
        addresses.indexOf(getBoxAddress(item)) !== -1,
    );
    if (filteredBoxes.length > 0) {
      const box = filteredBoxes[0];
      totalErg += BigInt(box.value().as_i64().to_str());
      tokens = [...tokens, ...getBoxTokens(box)];
    }
  }
  const outputs =
    tx instanceof wasm.Transaction
      ? (tx as wasm.Transaction).outputs()
      : (tx as wasm.UnsignedTransaction).output_candidates();
  for (let index = 0; index < outputs.len(); index++) {
    const box = outputs.get(index);
    if (addresses.indexOf(getBoxAddress(box)) !== -1) {
      totalErg -= BigInt(box.value().as_i64().to_str());
      tokens = [
        ...tokens,
        ...getBoxTokens(box).map((item) => ({
          tokenId: item.tokenId,
          balance: -item.balance,
        })),
      ];
    }
  }
  return {
    value: totalErg,
    tokens: receiverTokensToDict(tokens),
  };
};

const signNormalWalletReducedTx = async (
  wallet: StateWallet,
  password: string,
  tx: wasm.ReducedTransaction,
) => {
  const prover = await getProver(wallet, password);
  return prover.sign_reduced_transaction(tx);
};

const signNormalWalletTx = async (
  wallet: StateWallet,
  password: string,
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
  dataBoxes: Array<wasm.ErgoBox> = [],
  forceNode: boolean,
): Promise<wasm.Transaction> => {
  const prover = await getProver(wallet, password);
  const inputBoxes = wasm.ErgoBoxes.empty();
  boxes.forEach((box) => inputBoxes.add(box));
  const dataInputBoxes = wasm.ErgoBoxes.empty();
  dataBoxes.forEach((box) => dataInputBoxes.add(box));
  const chain = getChain(wallet.networkType);
  const context = forceNode
    ? await chain.getNodeNetwork().getContext()
    : await chain.getExplorerNetwork().getContext();
  return prover.sign_transaction(context, tx, inputBoxes, dataInputBoxes);
};

const openTxInBrowser = (networkType: string, txId: string) => {
  const explorerFront = getChain(networkType).getExplorerFront();
  openInBrowser(`${explorerFront}/en/transactions/${txId}`);
};

const getTxBoxes = (
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
) => {
  const res: Array<wasm.ErgoBox> = [];
  const inputs = tx.inputs();
  for (let index = 0; index < inputs.len(); index++) {
    const filtered = boxes.filter(
      (box) => box.box_id().to_str() === inputs.get(index).box_id().to_str(),
    );
    if (filtered.length === 0) throw Error('invalid boxes');
    res.push(filtered[0]);
  }
  return res;
};

export {
  newEmptyReceiver,
  extractErgAndTokenSpent,
  generateTx,
  getBoxTokens,
  signNormalWalletTx,
  signNormalWalletReducedTx,
  openTxInBrowser,
  getReduced,
  getTxBoxes,
  selectBoxes,
};

export type { ReceiverType };
