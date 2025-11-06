import * as wasm from '@minotaur-ergo/ergo-lib';
import { DerivedWalletAddress } from '@minotaur-ergo/types';
import { mnemonicToSeedSync } from 'bip39';
import * as console from 'console';

import { getChain } from './network';
import { bip32 } from './xpub';

const RootPathWithoutIndex = "m/44'/429'/0'/0";
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

const getNewAddressName = (name: string, index: number) => {
  if (!name) {
    if (index === 0) {
      return 'Main Address';
    }
    name = `Derived Address ${index}`;
  }
  return name;
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
  try {
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
  } catch (e) {
    console.log('Unable to find wallet addresses: ', e);
  }
  return addresses;
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
  RootPathWithoutIndex,
  calcPathFromIndex,
  getNewAddressName,
  deriveAddressFromXPub,
  findWalletAddresses,
  deriveAddressFromMnemonic,
};
