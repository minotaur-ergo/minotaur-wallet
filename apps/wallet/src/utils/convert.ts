import Wallet from '@/db/entities/Wallet';
import { StateAddress, StateWallet } from '@/store/reducer/wallet';
import Address from '@/db/entities/Address';
import { WALLET_FLAG_ENUM } from '@/utils/const';
import { blake2bHex } from 'blakejs';
import * as wasm from 'ergo-lib-wasm-browser';
import { createEmptyArrayWithIndex } from './functions';

export const walletEntityToWalletState = (wallet: Wallet): StateWallet => ({
  id: wallet.id,
  name: wallet.name,
  networkType: wallet.network_type,
  type: wallet.type,
  balance: '',
  tokens: [],
  addresses: [],
  xPub: wallet.extended_public_key,
  requiredSign: wallet.required_sign,
  seed: wallet.seed,
  version: wallet.version,
  flags: wallet.flags.split('|').filter(Boolean),
  archived: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.ARCHIVE),
  favorite: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.FAVORITE),
});

export const addressEntityToAddressState = (
  address: Address,
): StateAddress => ({
  address: address.address,
  walletId: address.wallet?.id || 0,
  balance: '',
  name: address.name,
  tokens: [],
  idx: address.idx,
  path: address.path,
  proceedHeight: address.process_height,
  id: address.id,
  isDefault: false,
});

export const boxesToArrayBox = (boxes: wasm.ErgoBoxes): Array<wasm.ErgoBox> => {
  return createEmptyArrayWithIndex(boxes.len()).map((index) =>
    boxes.get(index),
  );
};

export const boxArrayToBoxes = (boxes: Array<wasm.ErgoBox>): wasm.ErgoBoxes => {
  const res = wasm.ErgoBoxes.empty();
  boxes.forEach((box) => res.add(box));
  return res;
};

export const commaSeparate = (amount: string, fromEnd: boolean = true) => {
  const processingAmount = fromEnd
    ? amount.split('').reverse().join('')
    : amount;
  const chunks = processingAmount.match(/.{1,3}/g);
  const res = (chunks ?? []).join(',');
  return fromEnd ? res.split('').reverse().join('') : res;
};

export const pinHash = (pin: string) => {
  return blake2bHex(pin, undefined, 32);
};
