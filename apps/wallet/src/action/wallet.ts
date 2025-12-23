import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  DerivedWalletAddress,
  StateAddress,
  StateWallet,
  WalletType,
} from '@minotaur-ergo/types';
import {
  bip32,
  decrypt,
  encrypt,
  findWalletAddresses,
  getBase58ExtendedPublicKey,
  getChain,
  isValidAddress,
  RootPathWithoutIndex,
} from '@minotaur-ergo/utils';
import { mnemonicToSeedSync } from 'bip39';

import store from '@/store';
import { setActiveWallet } from '@/store/reducer/config';
import { addedWallets, invalidateWallets } from '@/store/reducer/wallet';
import { walletEntityToWalletState } from '@/utils/convert';

import {
  addWalletAddresses,
  deriveMultiSigWalletAddressFromXPubs,
  deriveNormalWalletAddress,
  getWalletAddressSecret,
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

const validateAddresses = async (addresses: Array<{ address: string }>) => {
  for (const addr of addresses) {
    const existing =
      await AddressDbAction.getInstance().getAddressByAddressString(
        addr.address,
      );

    if (existing) {
      const walletName = existing.wallet?.name || 'Unknown Wallet';
      throw new Error(
        `Address already exists: ${addr.address} in (Wallet: ${walletName})`,
      );
    }
  }
};

const createWallet = async (
  name: string,
  type: WalletType,
  mnemonic: string,
  password: string,
  network_type: string,
  encryptionPassword: string,
  syncWithNode: boolean,
  url: string,
  readOnlyWalletId?: number,
) => {
  const pinType = store.getState().config.pin.activePinType;
  const seed = mnemonicToSeedSync(mnemonic, password);
  const master = bip32.fromSeed(seed);
  const extended_public_key = master
    .derivePath(RootPathWithoutIndex)
    .neutered();

  const addresses = await findWalletAddresses(
    (index: number) =>
      deriveNormalWalletAddress(
        0,
        extended_public_key.toBase58(),
        network_type,
        index,
      ),
    network_type,
    syncWithNode,
    url,
  );
  if (readOnlyWalletId === undefined) {
    await validateAddresses(addresses);
  }

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
    readOnlyWalletId,
  );
  await WalletDbAction.getInstance().setFlagOnWallet(wallet.id, pinType, false);
  const stateWallet = walletEntityToWalletState(wallet);
  if (readOnlyWalletId === undefined) {
    await addWalletAddresses(stateWallet, addresses);
  }
  store.dispatch(addedWallets());
  store.dispatch(setActiveWallet({ activeWallet: wallet.id }));
};

const changeWalletPassword = async (
  walletId: number,
  oldPassword: string,
  newPassword: string,
) => {
  const wallet = await WalletDbAction.getInstance().getWalletById(walletId);
  if (wallet) {
    const seed = encrypt(decrypt(wallet.seed, oldPassword), newPassword);
    const mnemonic = encrypt(
      decrypt(wallet.encrypted_mnemonic, oldPassword),
      newPassword,
    );
    await WalletDbAction.getInstance().changeSeedAndMnemonic(
      walletId,
      seed,
      mnemonic,
    );
    store.dispatch(invalidateWallets());
  }
};

const createReadOnlyWallet = async (
  name: string,
  address: string,
  extended_public_key: string,
  network_type: string,
  syncWithNode: boolean,
  url: string,
) => {
  const pinType = store.getState().config.pin.activePinType;
  let addresses: DerivedWalletAddress[] = [];

  if (extended_public_key) {
    addresses = await findWalletAddresses(
      (index: number) =>
        deriveNormalWalletAddress(0, extended_public_key, network_type, index),
      network_type,
      syncWithNode,
      url,
    );
  } else if (address) {
    addresses = [
      {
        address,
        path: '',
        index: 0,
      },
    ];
  }
  await validateAddresses(addresses);

  const walletEntity = await WalletDbAction.getInstance().createWallet(
    name,
    WalletType.ReadOnly,
    ' ',
    extended_public_key,
    network_type,
    1,
    '',
  );
  await WalletDbAction.getInstance().setFlagOnWallet(
    walletEntity.id,
    pinType,
    false,
  );

  const walletState = walletEntityToWalletState(walletEntity);
  await addWalletAddresses(walletState, addresses);

  store.dispatch(addedWallets());
  store.dispatch(setActiveWallet({ activeWallet: walletEntity.id }));
};

const createMultiSigWallet = async (
  name: string,
  walletId: number,
  keys: Array<string>,
  minSig: number,
  syncWithNode: boolean,
  url: string,
) => {
  const pinType = store.getState().config.pin.activePinType;
  const wallet = await WalletDbAction.getInstance().getWalletById(walletId);
  if (wallet) {
    const is_derivable =
      !!wallet.extended_public_key && !isValidAddress(keys[0]);
    if (!is_derivable || keys.some((key) => !getBase58ExtendedPublicKey(key)))
      throw Error(
        'Only wallet with extended public key allowed for multi-sig wallet creation',
      );
    const prefix = getChain(wallet.network_type).prefix;
    const addresses = await findWalletAddresses(
      (index: number) =>
        Promise.resolve(
          deriveMultiSigWalletAddressFromXPubs(
            [...keys, wallet.extended_public_key],
            minSig,
            prefix,
            1,
            index,
          ),
        ),
      wallet.network_type,
      syncWithNode,
      url,
    );
    await validateAddresses(addresses);
    const createdWallet = await WalletDbAction.getInstance().createWallet(
      name,
      WalletType.MultiSig,
      '',
      is_derivable ? wallet.extended_public_key : '',
      wallet.network_type,
      minSig,
      '',
    );
    await WalletDbAction.getInstance().setFlagOnWallet(
      createdWallet.id,
      pinType,
      false,
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
    const walletState = walletEntityToWalletState(createdWallet);
    await addWalletAddresses(walletState, addresses);
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
  changeWalletPassword,
  getProver,
};
