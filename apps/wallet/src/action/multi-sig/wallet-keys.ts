import { StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';
import { bip32, createEmptyArrayWithIndex } from '@minotaur/common';
import * as wasm from '@minotaur/ergo-lib';

import { MultiSigDbAction } from '../db';

const getInputMap = async (
  wallet: StateWallet,
  boxes: Array<wasm.ErgoBox>,
): Promise<{ [boxId: string]: string }> => {
  const networkPrefix = getChain(wallet.networkType).prefix;
  const res: { [boxId: string]: string } = {};
  createEmptyArrayWithIndex(boxes.length).forEach((index) => {
    const box = boxes[index];
    res[box.box_id().to_str()] = wasm.Address.recreate_from_ergo_tree(
      box.ergo_tree(),
    ).to_base58(networkPrefix);
  });
  return res;
};

const getMultiSigWalletPublicKeys = async (
  multiSigWallet: StateWallet,
  signingWallet: StateWallet,
) => {
  const extendedKeys = (
    await MultiSigDbAction.getInstance().getWalletExternalKeys(
      multiSigWallet.id,
    )
  ).map((item) => item.extended_key);
  extendedKeys.push(signingWallet.xPub);
  const res: { [address: string]: Array<string> } = {};
  const derive_path = extendedKeys.map((item) => bip32.fromBase58(item));
  multiSigWallet.addresses.forEach((address) => {
    res[address.address] = derive_path
      .map((derive_key) =>
        derive_key.derive(address.idx).publicKey.toString('hex'),
      )
      .sort();
  });
  return res;
};

const getMultiSigWalletMyPublicKeys = async (
  multiSigWallet: StateWallet,
  signingWallet: StateWallet,
) => {
  const res: { [address: string]: string } = {};
  const derive_path = bip32.fromBase58(signingWallet.xPub);
  multiSigWallet.addresses.forEach((address) => {
    res[address.address] = derive_path
      .derive(address.idx)
      .publicKey.toString('hex');
  });
  return res;
};

const getInputPks = async (
  wallet: StateWallet,
  signerWallet: StateWallet,
  tx: wasm.UnsignedTransaction | wasm.Transaction,
  boxes: Array<wasm.ErgoBox>,
): Promise<Array<Array<string>>> => {
  const pks = await getMultiSigWalletPublicKeys(wallet, signerWallet);
  const inputMap = await getInputMap(wallet, boxes);
  const inputs = tx.inputs();
  return createEmptyArrayWithIndex(inputs.len())
    .map((index) => inputs.get(index))
    .map((box) => inputMap[box.box_id().to_str()])
    .map((address) => [...pks[address]]);
};

const getMyInputPks = async (
  wallet: StateWallet,
  signerWallet: StateWallet,
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
): Promise<Array<string>> => {
  const pks = await getMultiSigWalletMyPublicKeys(wallet, signerWallet);
  const inputMap = await getInputMap(wallet, boxes);
  const inputs = tx.inputs();
  return createEmptyArrayWithIndex(inputs.len())
    .map((index) => inputs.get(index))
    .map((box) => inputMap[box.box_id().to_str()])
    .map((address) => pks[address]);
};

export { getInputPks, getMyInputPks };
