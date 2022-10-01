import { WalletType } from '../db/entities/Wallet';
import { store } from '../store';
import * as actionTypes from '../store/actionType';
import { mnemonicToSeedSync } from 'bip39';
import { bip32 } from '../util/util';
import { encrypt } from './enc';
import { AddressDbAction, AssetDbAction, WalletDbAction } from './db';
import * as wasm from 'ergo-lib-wasm-browser';
import Wallet from '../db/entities/Wallet';
import Address from '../db/entities/Address';
import { decrypt } from './enc';
import { getNetworkType } from '../util/network_type';

const RootPathWithoutIndex = "m/44'/429'/0'/0";
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

class AddressActionClass {
  addWalletAddresses = async (wallet: Wallet) => {
    const network_type = getNetworkType(wallet.network_type);
    let addressObject = await this.deriveAddress(
      wallet.extended_public_key,
      network_type.prefix,
      0
    );
    await AddressDbAction.saveAddress(
      wallet,
      'Main Address',
      addressObject.address,
      addressObject.path,
      0
    );
    try {
      let index = 1;
      while (true) {
        addressObject = await this.deriveAddress(
          wallet.extended_public_key,
          network_type.prefix,
          index
        );
        const explorer = getNetworkType(wallet.network_type).getExplorer();
        const txs = await explorer.getTxsByAddress(addressObject.address, {
          offset: 0,
          limit: 1,
        });
        if (txs.total > 0) {
          await AddressDbAction.saveAddress(
            wallet,
            `Derived Address ${index}`,
            addressObject.address,
            addressObject.path,
            index
          );
        } else {
          break;
        }
        index++;
      }
    } catch (e) {
      console.error(e);
    }
  };

  getWalletAddressSecret = async (
    wallet: Wallet,
    password: string,
    address: Address
  ) => {
    const seed = decrypt(wallet.seed, password);
    const path =
      address.idx === -1 ? address.path : calcPathFromIndex(address.idx);
    const extended = bip32.fromSeed(seed).derivePath(path);
    return wasm.SecretKey.dlog_from_bytes(
      Uint8Array.from(extended.privateKey!)
    );
  };

  deriveAddress = async (
    extended_public_key: string,
    NETWORK_TYPE: wasm.NetworkPrefix,
    index: number
  ) => {
    const pub = bip32.fromBase58(extended_public_key);
    const derived1 = pub.derive(index);
    const address = wasm.Address.from_public_key(
      Uint8Array.from(derived1.publicKey)
    );
    const path = calcPathFromIndex(index);
    return {
      address: address.to_base58(NETWORK_TYPE),
      path: path,
    };
  };

  deriveAddressFromMnemonic = async (
    mnemonic: string,
    password: string,
    NETWORK_TYPE: wasm.NetworkPrefix,
    index: number
  ) => {
    const seed = mnemonicToSeedSync(mnemonic, password);
    const path = calcPathFromIndex(index);
    const extended = bip32.fromSeed(seed).derivePath(path);
    const secret = wasm.SecretKey.dlog_from_bytes(
      Buffer.from(extended.privateKey!)
    );
    return {
      address: secret.get_address().to_base58(NETWORK_TYPE),
      path: path,
    };
  };

  getNewAddressName = async (walletId: number, name: string) => {
    if (!name) {
      const index = (await this.getWalletAddresses(walletId)).length;
      name = `Derived Address ${index}`;
    }
    return name;
  };

  deriveNewAddress = async (wallet: Wallet, name: string) => {
    const network_type = getNetworkType(wallet.network_type);
    const index = (await AddressDbAction.getLastAddress(wallet.id)) + 1;
    name = name ? name : await this.getNewAddressName(wallet.id, name);
    const address = await this.deriveAddress(
      wallet.extended_public_key,
      network_type.prefix,
      index ? index : 0
    );
    await AddressDbAction.saveAddress(
      wallet,
      name,
      address.address,
      address.path,
      index ? index : 0
    );
  };

  deriveReadOnlyAddress = async (
    wallet: Wallet,
    address: string,
    name: string
  ) => {
    name = name ? name : await this.getNewAddressName(wallet.id, name);
    await AddressDbAction.saveAddress(wallet, name, address, 'no-path', -1);
  };

  validatePassword = (wallet: Wallet, password: string) => {
    try {
      decrypt(wallet.seed, password);
      return true;
    } catch (e) {
      return false;
    }
  };

  getAddress = async (addressId: number) => {
    return await AddressDbAction.getAddress(addressId);
  };

  getWalletAddresses = async (walletId: number) => {
    return AddressDbAction.getWalletAddresses(walletId);
  };

  updateAddressName = async (walletId: number, newName: string) => {
    return AddressDbAction.updateAddressName(walletId, newName);
  };
}

class WalletActionClass {
  createWallet = async (
    name: string,
    type: WalletType,
    mnemonic: string,
    password: string,
    network_type: string,
    encryptionPassword: string
  ) => {
    const seed = mnemonicToSeedSync(mnemonic, password);
    const master = bip32.fromSeed(seed);
    const extended_public_key = master
      .derivePath(RootPathWithoutIndex)
      .neutered();
    const storedSeed = encryptionPassword
      ? encrypt(seed, encryptionPassword)
      : seed.toString('hex');
    const wallet = await WalletDbAction.createWallet(
      name,
      type,
      storedSeed,
      extended_public_key.toBase58(),
      network_type
    );
    await AddressAction.addWalletAddresses(wallet);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
  };

  createReadOnlyWallet = async (
    name: string,
    address: string,
    network_type: string
  ) => {
    const walletEntity = await WalletDbAction.createWallet(
      name,
      WalletType.ReadOnly,
      ' ',
      ' ',
      network_type
    );
    await AddressDbAction.saveAddress(
      walletEntity,
      'Main Address',
      address,
      '--',
      0
    );
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
  };

  createExtendedReadOnlyWallet = async (
    name: string,
    extended_public_key: string,
    network_type: string
  ) => {
    const wallet = await WalletDbAction.createWallet(
      name,
      WalletType.ReadOnly,
      ' ',
      extended_public_key,
      network_type
    );
    await AddressAction.addWalletAddresses(wallet);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
  };

  loadWallets = async () => {
    if (!store.getState().wallet.walletValid) {
      const wallets = await WalletDbAction.getWalletsWithErg();
      store.dispatch({ type: actionTypes.SET_WALLETS, payload: wallets });
    }
  };
}

class AssetActionClass {
  updateTokenInfo = async (tokenId: string, network_type: string) => {
    const explorer = getNetworkType(network_type).getExplorer();
    const info = await explorer.getFullTokenInfo(tokenId);
    if (info) {
      await AssetDbAction.createOrUpdateAsset(info, network_type);
    }
  };
}

const AssetAction = new AssetActionClass();
const WalletAction = new WalletActionClass();
const AddressAction = new AddressActionClass();

export { AssetAction, WalletAction, AddressAction };
