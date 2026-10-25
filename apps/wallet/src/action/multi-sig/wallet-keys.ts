import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';
import {
  bip32,
  createEmptyArrayWithIndex,
  getChain,
} from '@minotaur-ergo/utils';

import { MultiSigDbAction } from '../db';

// address of each box, keyed by box id
type BoxAddressMap = { [boxId: string]: string };

const getInputMap = (
  wallet: StateWallet,
  boxes: Array<wasm.ErgoBox>,
): BoxAddressMap => {
  const networkPrefix = getChain(wallet.networkType).prefix;
  const res: BoxAddressMap = {};
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
  inputs: wasm.UnsignedInputs | wasm.Inputs,
  inputMap: BoxAddressMap,
): Promise<Array<Array<string>>> => {
  const pks = await getMultiSigWalletPublicKeys(wallet, signerWallet);
  return createEmptyArrayWithIndex(inputs.len())
    .map((index) => inputs.get(index))
    .map((box) => inputMap[box.box_id().to_str()])
    .map((address) => [...pks[address]]);
};

const getMyInputPks = async (
  wallet: StateWallet,
  signerWallet: StateWallet,
  inputs: wasm.UnsignedInputs,
  inputMap: BoxAddressMap,
): Promise<Array<string>> => {
  const pks = await getMultiSigWalletMyPublicKeys(wallet, signerWallet);
  return createEmptyArrayWithIndex(inputs.len())
    .map((index) => inputs.get(index))
    .map((box) => inputMap[box.box_id().to_str()])
    .map((address) => pks[address]);
};

export { getInputPks, getMyInputPks, getInputMap };
