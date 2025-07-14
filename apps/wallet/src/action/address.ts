import {
  DerivedWalletAddress,
  StateAddress,
  StateWallet,
  WalletType,
} from '@minotaur-ergo/types';
import {
  bip32,
  decrypt,
  getChain,
  int8Vlq,
  iterateIndexes,
  uInt8Vlq,
} from '@minotaur-ergo/utils';
import { mnemonicToSeedSync } from 'bip39';
import * as wasm from 'ergo-lib-wasm-browser';

import { AddressDbAction, MultiSigDbAction } from './db';

const RootPathWithoutIndex = "m/44'/429'/0'/0";
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

const getNewAddressName = async (name: string, index: number) => {
  if (!name) {
    if (index === 0) {
      return 'Main Address';
    }
    name = `Derived Address ${index}`;
  }
  return name;
};

const generateMultiSigV1AddressFromPublicKeys = (
  publicKeys: Array<string>,
  minSign: number,
  prefix: wasm.NetworkPrefix,
) => {
  let ergoTree = '10' + uInt8Vlq(publicKeys.length + 1);
  ergoTree += '04' + int8Vlq(minSign);
  publicKeys.sort().forEach((item) => (ergoTree += '08cd' + item));
  ergoTree += '987300';
  ergoTree += `83${uInt8Vlq(publicKeys.length)}08`; // add coll operation
  iterateIndexes(publicKeys.length).forEach(
    (index: number) => (ergoTree += '73' + uInt8Vlq(index + 1)),
  );
  return wasm.Address.recreate_from_ergo_tree(
    wasm.ErgoTree.from_base16_bytes(ergoTree),
  ).to_base58(prefix);
};

const generateMultiSigAddressFromPublicKeys = (
  publicKeys: Array<string>,
  minSign: number,
  prefix: wasm.NetworkPrefix,
  version: number,
) => {
  switch (version) {
    case 1:
      return generateMultiSigV1AddressFromPublicKeys(
        publicKeys,
        minSign,
        prefix,
      );
    default:
      throw Error('invalid version');
  }
};

const deriveMultiSigWalletAddress = async (
  wallet: StateWallet,
  index?: number,
) => {
  const walletKey = await MultiSigDbAction.getInstance().getWalletInternalKey(
    wallet.id,
  );
  const keys = await MultiSigDbAction.getInstance().getWalletExternalKeys(
    wallet.id,
  );
  const usedIndex =
    index === undefined
      ? (await AddressDbAction.getInstance().getLastAddressIndex(wallet.id)) + 1
      : index;
  const extended_keys = [...keys.map((item) => item.extended_key)];
  if (walletKey) extended_keys.push(walletKey.extended_public_key);
  const pub_keys = extended_keys.map((key) => {
    const pub = bip32.fromBase58(key);
    const derived1 = pub.derive(usedIndex);
    return derived1.publicKey.toString('hex');
  });
  const chain = getChain(wallet.networkType);
  const address = generateMultiSigAddressFromPublicKeys(
    pub_keys,
    wallet.requiredSign,
    chain.prefix,
    wallet.version,
  );
  const path = calcPathFromIndex(usedIndex);
  return {
    address: address,
    path: path,
    index: usedIndex,
  };
};

const deriveAddressFromXPub = (
  xPub: string,
  networkPrefix: wasm.NetworkPrefix,
  index: number,
) => {
  const pub = bip32.fromBase58(xPub);
  const derived1 = pub.derive(index);
  const address = wasm.Address.from_public_key(
    Uint8Array.from(derived1.publicKey),
  );
  const path = calcPathFromIndex(index);
  return {
    address: address.to_base58(networkPrefix),
    path: path,
  };
};

const deriveNormalWalletAddress = async (
  walletId: number,
  xPub: string,
  networkType: string,
  index?: number,
) => {
  if (!xPub) {
    throw Error('Wallet can not have more addresses');
  }
  const usedIndex =
    index === undefined
      ? (await AddressDbAction.getInstance().getLastAddressIndex(walletId)) + 1
      : index;
  const chain = getChain(networkType);
  return deriveAddressFromXPub(xPub, chain.prefix, usedIndex);
};

const deriveWalletAddress = (wallet: StateWallet, index?: number) => {
  switch (wallet.type) {
    case WalletType.MultiSig:
      return deriveMultiSigWalletAddress(wallet, index);
    case WalletType.Normal:
    case WalletType.ReadOnly:
      return deriveNormalWalletAddress(
        wallet.id,
        wallet.networkType,
        wallet.xPub,
        index,
      );
  }
  throw Error('invalid wallet type');
};

const findWalletAddresses = async (
  derive: (index: number) => Promise<{ address: string; path: string }>,
  networkType: string,
) => {
  const addresses: DerivedWalletAddress[] = [];

  const chain = getChain(networkType);
  const network = chain.getNetwork();
  const firstAddress = await derive(0);
  addresses.push({
    address: firstAddress.address,
    path: firstAddress.path,
    index: 0,
  });

  let index = 1;
  for (;;) {
    const addressObject = await derive(index);
    const txCount = await network.getAddressTransactionCount(
      addressObject.address,
    );
    if (txCount > 0) {
      addresses.push({
        address: addressObject.address,
        path: addressObject.path,
        index,
      });
    } else {
      break;
    }
    index++;
  }

  return addresses;
};

const addWalletAddresses = async (
  wallet: StateWallet,
  addresses: DerivedWalletAddress[],
) => {
  try {
    for (const addr of addresses) {
      const name = await getNewAddressName('', addr.index);
      await AddressDbAction.getInstance().saveAddress(
        wallet.id,
        name,
        addr.address,
        addr.path,
        addr.index,
      );
    }
  } catch (err) {
    console.error(err);
    throw new Error('Failed to insert wallet addresses.');
  }
};

const deriveNewAddress = async (wallet: StateWallet, name: string) => {
  const index =
    (await AddressDbAction.getInstance().getLastAddressIndex(wallet.id)) + 1;
  name = name ? name : await getNewAddressName(name, index);
  const address = await deriveWalletAddress(wallet);
  if (!address) {
    throw Error('Wallet can not have new addresses');
  }
  await AddressDbAction.getInstance().saveAddress(
    wallet.id,
    name,
    address.address,
    address.path,
    index,
  );
};

const getWalletAddressSecret = (
  wallet: StateWallet,
  address: StateAddress,
  password: string,
) => {
  const seed = decrypt(wallet.seed, password);
  const path =
    address.idx === -1 ? address.path : calcPathFromIndex(address.idx);
  const extended = bip32.fromSeed(seed).derivePath(path);
  return wasm.SecretKey.dlog_from_bytes(
    Uint8Array.from(
      extended.privateKey ? extended.privateKey : Buffer.from(''),
    ),
  );
};

const deriveAddressFromMnemonic = async (
  mnemonic: string,
  password: string,
  NETWORK_TYPE: wasm.NetworkPrefix,
  index: number,
) => {
  const seed = mnemonicToSeedSync(mnemonic, password);
  const path = calcPathFromIndex(index);
  const extended = bip32.fromSeed(seed).derivePath(path);
  const secret = wasm.SecretKey.dlog_from_bytes(
    extended.privateKey ? extended.privateKey : Buffer.from(''),
  );
  return {
    address: secret.get_address().to_base58(NETWORK_TYPE),
    path: path,
  };
};

export {
  deriveNewAddress,
  deriveAddressFromMnemonic,
  deriveNormalWalletAddress,
  deriveMultiSigWalletAddress,
  generateMultiSigAddressFromPublicKeys,
  findWalletAddresses,
  addWalletAddresses,
  deriveAddressFromXPub,
  RootPathWithoutIndex,
  getWalletAddressSecret,
};
