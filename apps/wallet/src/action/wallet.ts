import { setActiveWallet } from '@/store/reducer/config';
import { mnemonicToSeedSync } from 'bip39';
import * as wasm from 'ergo-lib-wasm-browser';
import { WalletType } from '@/db/entities/Wallet';
import store from '@/store';
import {
  addedWallets,
  StateAddress,
  StateWallet,
} from '@/store/reducer/wallet';
import { walletEntityToWalletState } from '@/utils/convert';
import { decrypt, encrypt } from '@/utils/enc';
import {
  bip32,
  getBase58ExtendedPublicKey,
  isValidAddress,
} from '@/utils/functions';
import {
  RootPathWithoutIndex,
  getWalletAddressSecret,
  addAllWalletAddresses,
} from './address';
import { AddressDbAction, MultiSigDbAction, WalletDbAction } from './db';

const validatePassword = (seed: string, password: string) => {
  try {
    const res = decrypt(seed, password);
    return res.length > 0;
  } catch (e) {
    return false;
  }
};

const createWallet = async (
  name: string,
  type: WalletType,
  mnemonic: string,
  password: string,
  network_type: string,
  encryptionPassword: string,
) => {
  const seed = mnemonicToSeedSync(mnemonic, password);
  const master = bip32.fromSeed(seed);
  const extended_public_key = master
    .derivePath(RootPathWithoutIndex)
    .neutered();
  const storedSeed = encryptionPassword
    ? encrypt(seed, encryptionPassword)
    : seed.toString('hex');
  const encryptedMnemonic = encryptionPassword
    ? encrypt(Buffer.from(mnemonic, 'utf-8'), encryptionPassword)
    : '';
  const wallet = await WalletDbAction.getInstance().createWallet(
    name,
    type,
    storedSeed,
    extended_public_key.toBase58(),
    network_type,
    1,
    encryptedMnemonic,
  );
  await addAllWalletAddresses(walletEntityToWalletState(wallet));
  store.dispatch(addedWallets());
  store.dispatch(setActiveWallet({ activeWallet: wallet.id }));
};

const createReadOnlyWallet = async (
  name: string,
  address: string,
  extended_public_key: string,
  network_type: string,
) => {
  const walletEntity = await WalletDbAction.getInstance().createWallet(
    name,
    WalletType.ReadOnly,
    ' ',
    extended_public_key,
    network_type,
    1,
    '',
  );
  if (extended_public_key) {
    await addAllWalletAddresses(walletEntityToWalletState(walletEntity));
  } else {
    await AddressDbAction.getInstance().saveAddress(
      walletEntity.id,
      'Main Address',
      address,
      '--',
      0,
    );
  }
  store.dispatch(addedWallets());
  store.dispatch(setActiveWallet({ activeWallet: walletEntity.id }));
};

const createMultiSigWallet = async (
  name: string,
  walletId: number,
  keys: Array<string>,
  minSig: number,
) => {
  const wallet = await WalletDbAction.getInstance().getWalletById(walletId);
  if (wallet) {
    const is_derivable =
      !!wallet.extended_public_key && !isValidAddress(keys[0]);
    const createdWallet = await WalletDbAction.getInstance().createWallet(
      name,
      WalletType.MultiSig,
      '',
      is_derivable ? wallet.extended_public_key : '',
      wallet.network_type,
      minSig,
      '',
    );
    await MultiSigDbAction.getInstance().createKey(
      createdWallet,
      wallet.extended_public_key,
      wallet,
    );
    for (const key of keys) {
      const base58 = getBase58ExtendedPublicKey(key);
      if (base58) {
        await MultiSigDbAction.getInstance().createKey(
          createdWallet,
          base58,
          null,
        );
      } else {
        throw Error('unreachable');
      }
    }
    await addAllWalletAddresses(walletEntityToWalletState(createdWallet));
    store.dispatch(addedWallets());
    store.dispatch(setActiveWallet({ activeWallet: wallet.id }));
  }
};

const getProver = async (
  wallet: StateWallet,
  password: string,
  addresses?: Array<StateAddress>,
) => {
  const secretKeys = new wasm.SecretKeys();
  (addresses ? addresses : wallet.addresses).forEach((address) => {
    secretKeys.add(getWalletAddressSecret(wallet, address, password));
  });
  return wasm.Wallet.from_secrets(secretKeys);
};

export {
  createWallet,
  createReadOnlyWallet,
  validatePassword,
  createMultiSigWallet,
  getProver,
};
