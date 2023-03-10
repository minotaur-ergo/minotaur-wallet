import Wallet, { WalletType } from '../db/entities/Wallet';
import { store } from '../store';
import * as actionTypes from '../store/actionType';
import { mnemonicToSeedSync } from 'bip39';
import * as wasm from 'ergo-lib-wasm-browser';
import Address from '../db/entities/Address';
import {
  bip32,
  get_base58_extended_public_key,
  int8_vlq,
  is_valid_address,
  uint8_vlq,
} from '../util/util';
import { encrypt, decrypt } from './enc';
import {
  AddressDbAction,
  AssetDbAction,
  MultiSigDbAction,
  WalletDbAction,
} from './db';
import { getNetworkType, NetworkType } from '../util/network_type';
import { WalletStateType } from '../store/reducer/wallet';

const RootPathWithoutIndex = "m/44'/429'/0'/0";
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

export type HintType = {
  hint: string;
  secret?: string;
  pubkey: {
    op: string;
    h: string;
  };
  type: string;
  a: string;
  position: string;
};

class MultiSigActionClass {
  getMultiSigWalletProver = async (
    multiSigWallet: Wallet,
    signingWallet: Wallet,
    password: string
  ) => {
    const addresses = await AddressDbAction.getWalletAddresses(
      multiSigWallet.id
    );
    const seed = decrypt(signingWallet.seed, password);
    const secrets = new wasm.SecretKeys();
    for (const address of addresses) {
      const path = calcPathFromIndex(address.idx === -1 ? 0 : address.idx);
      const secret = await AddressAction.getSecretFromPath(seed, path);
      secrets.add(secret);
    }
    return wasm.Wallet.from_secrets(secrets);
  };

  getMultiSigWalletPublicKeys = async (
    multiSigWallet: Wallet,
    signingWallet: Wallet
  ) => {
    const addresses = await AddressDbAction.getWalletAddresses(
      multiSigWallet.id
    );
    const extendedKeys = (
      await MultiSigDbAction.getWalletExternalKeys(multiSigWallet.id)
    ).map((item) => item.extended_key);
    extendedKeys.push(signingWallet.extended_public_key);
    const res: { [address: string]: Array<string> } = {};
    const derive_path = extendedKeys.map((item) => bip32.fromBase58(item));
    addresses.forEach((address) => {
      res[address.address] = derive_path
        .map((derive_key) =>
          derive_key.derive(address.idx).publicKey.toString('hex')
        )
        .sort();
    });
    return res;
  };

  getMultiSigWalletMyPublicKeys = async (
    multiSigWallet: Wallet,
    signingWallet: Wallet
  ) => {
    const addresses = await AddressDbAction.getWalletAddresses(
      multiSigWallet.id
    );
    const res: { [address: string]: string } = {};
    const derive_path = bip32.fromBase58(signingWallet.extended_public_key);
    addresses.forEach((address) => {
      res[address.address] = derive_path
        .derive(address.idx)
        .publicKey.toString('hex');
    });
    return res;
  };

  getAddressToSecretMap = async (
    multiSigWallet: Wallet,
    signingWallet: Wallet,
    password: string
  ) => {
    const addresses = await AddressDbAction.getWalletAddresses(
      multiSigWallet.id
    );
    const seed = decrypt(signingWallet.seed, password);
    const res: { [ergoTree: string]: wasm.SecretKey } = {};
    for (const address of addresses) {
      const path = calcPathFromIndex(address.idx === -1 ? 0 : address.idx);
      const ergoTree = wasm.Address.from_base58(address.address)
        .to_ergo_tree()
        .to_base16_bytes();
      res[ergoTree] = await AddressAction.getSecretFromPath(seed, path);
    }
    return res;
  };

  extractCommitments = (
    commitment: wasm.TransactionHintsBag,
    inputLength: number
  ) => {
    const tx_known = wasm.TransactionHintsBag.empty();
    const tx_own = wasm.TransactionHintsBag.empty();
    for (let index = 0; index < inputLength; index++) {
      const input_commitments = commitment.all_hints_for_input(index);
      const input_known = wasm.HintsBag.empty();
      input_known.add_commitment(input_commitments.get(0));
      tx_known.add_hints_for_input(index, input_known);
      const input_own = wasm.HintsBag.empty();
      input_own.add_commitment(input_commitments.get(1));
      tx_own.add_hints_for_input(index, input_own);
    }
    return {
      public: tx_known,
      private: tx_own,
    };
  };

  generateCommitments = async (
    wallet: wasm.Wallet,
    tx: wasm.ReducedTransaction
  ) => {
    const commitment = wallet.generate_commitments_for_reduced_transaction(tx);
    return this.extractCommitments(commitment, tx.unsigned_tx().inputs().len());
  };

  commitmentToByte = (
    commitment: wasm.TransactionHintsBag,
    inputPublicKeys: Array<Array<string>>,
    returnSecret = false // TODO must change to password. if password pass encrypt commitment and return
  ): Array<Array<string>> => {
    const json = commitment.to_json()['publicHints'];
    return inputPublicKeys.map((rowPublicKeys, index) => {
      const hints = json[`${index}`];
      const rowCommitments = rowPublicKeys.map(() => '');
      hints.forEach(
        (item: { pubkey: { h: string }; a: string; secret: string }) => {
          const pubIndex = rowPublicKeys.indexOf(item.pubkey.h);
          if (pubIndex >= 0)
            rowCommitments[pubIndex] = Buffer.from(
              returnSecret ? item.secret : item.a,
              'hex'
            ).toString('base64');
        }
      );
      return rowCommitments;
    });
  };

  overridePublicCommitments = (
    baseCommitments: Array<Array<string>>,
    override: Array<Array<string>>
  ): { commitments: Array<Array<string>>; changed: boolean } => {
    if (baseCommitments.length !== override.length) {
      return { commitments: [...override], changed: true };
    }
    let changed = false;
    const commitments = baseCommitments.map((inputCommitments, index) => {
      const overrideRow = override[index];
      return inputCommitments.map((commitment, index) => {
        if (overrideRow[index] !== commitment && overrideRow[index] !== '')
          changed = true;
        return overrideRow[index] ? overrideRow[index] : commitment;
      });
    });
    return {
      commitments: commitments,
      changed: changed,
    };
  };

  generateHintBagJson = (
    publicKey: string,
    commitment: string,
    index: number,
    secret: string,
    password?: string
  ): HintType => {
    const res: HintType = {
      hint: secret ? 'cmtWithSecret' : 'cmtReal',
      pubkey: {
        op: '205',
        h: publicKey,
      },
      type: 'dlog',
      a: Buffer.from(commitment, 'base64').toString('hex').toLowerCase(),
      position: `0-${index}`,
    };
    if (secret && password) {
      res['secret'] = decrypt(secret, password).toString('hex');
    }
    return res;
  };

  getSecretHintBag = (
    publicKeys: Array<Array<string>>,
    commitments: Array<Array<string>>,
    secrets: Array<Array<string>>,
    password: string
  ): wasm.TransactionHintsBag => {
    const publicJson: { [key: string]: Array<HintType> } = {};
    const secretJson: { [key: string]: Array<HintType> } = {};
    publicKeys.forEach((inputPublicKeys, index) => {
      const inputCommitments = commitments[index];
      const inputSecrets =
        secrets && secrets.length > index ? secrets[index] : [];
      inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
        if (inputCommitments[pkIndex]) {
          const commitment = this.generateHintBagJson(
            inputPublicKey,
            inputCommitments[pkIndex],
            pkIndex,
            ''
          );
          if (publicJson[`${index}`]) {
            publicJson[`${index}`].push(commitment);
          } else {
            publicJson[`${index}`] = [commitment];
          }
          if (inputSecrets[pkIndex]) {
            const secretCommitment = this.generateHintBagJson(
              inputPublicKey,
              inputCommitments[pkIndex],
              pkIndex,
              inputSecrets[pkIndex],
              password
            );
            publicJson[`${index}`].push(secretCommitment);
          }
        }
      });
      secretJson[`${index}`] = [];
    });
    const resJson = { secretHints: secretJson, publicHints: publicJson };
    return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
  };

  getHintBags = (
    publicKeys: Array<Array<string>>,
    commitments: Array<Array<string>>
  ): wasm.TransactionHintsBag => {
    const publicJson: { [key: string]: Array<HintType> } = {};
    const secretJson: { [key: string]: Array<HintType> } = {};
    publicKeys.forEach((inputPublicKeys, index) => {
      const inputCommitments = commitments[index];
      inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
        if (inputCommitments[pkIndex]) {
          const commitment = this.generateHintBagJson(
            inputPublicKey,
            inputCommitments[pkIndex],
            pkIndex,
            ''
          );
          if (publicJson[`${index}`]) {
            publicJson[`${index}`].push(commitment);
          } else {
            publicJson[`${index}`] = [commitment];
          }
        }
      });
      secretJson[`${index}`] = [];
    });
    const resJson = { secretHints: secretJson, publicHints: publicJson };
    return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
  };
}

class AddressActionClass {
  addWalletAddresses = async (wallet: Wallet) => {
    const deriveAddressAtIndex = async (index: number) => {
      if (wallet.type === WalletType.MultiSig) {
        return await this.deriveMultiSigWalletAddress(wallet, index);
      } else {
        return await this.deriveAddress(
          wallet.extended_public_key,
          network_type.prefix,
          index
        );
      }
    };
    const network_type = getNetworkType(wallet.network_type);
    let addressObject = await deriveAddressAtIndex(0);
    await AddressDbAction.saveAddress(
      wallet,
      'Main Address',
      addressObject.address,
      addressObject.path,
      0
    );
    try {
      let index = 1;
      for (;;) {
        addressObject = await deriveAddressAtIndex(index);
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

  deriveMultiSigWalletAddress = async (wallet: Wallet, index?: number) => {
    const walletKey = await MultiSigDbAction.getWalletInternalKey(wallet.id);
    const keys = await MultiSigDbAction.getWalletExternalKeys(wallet.id);
    if (index === undefined) {
      index = (await AddressDbAction.getLastAddress(wallet.id)) + 1;
    }
    const extended_keys = [...keys.map((item) => item.extended_key)];
    if (walletKey) extended_keys.push(walletKey.extended_public_key);
    const pub_keys = extended_keys.map((key) => {
      const pub = bip32.fromBase58(key);
      const derived1 = pub.derive(index ? index : 0);
      return derived1.publicKey.toString('hex');
    });
    const address = this.generateMultiSigAddressFromAddresses(
      pub_keys,
      parseInt(wallet.seed),
      getNetworkType(wallet.network_type)
    );
    const path = calcPathFromIndex(index ? index : 0);
    return {
      address: address,
      path: path,
      index: index ? index : 0,
    };
  };

  deriveNewMultiSigWalletAddress = async (wallet: Wallet, name: string) => {
    const address = await this.deriveMultiSigWalletAddress(wallet);
    name = name ? name : await this.getNewAddressName(wallet.id, name);
    await AddressDbAction.saveAddress(
      wallet,
      name,
      address.address,
      address.path,
      address.index
    );
  };

  getSecretFromPath = async (seed: Buffer, path: string) => {
    const extended = bip32.fromSeed(seed).derivePath(path);
    return wasm.SecretKey.dlog_from_bytes(
      Uint8Array.from(
        extended.privateKey ? extended.privateKey : Buffer.from('')
      )
    );
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
      Uint8Array.from(
        extended.privateKey ? extended.privateKey : Buffer.from('')
      )
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
      extended.privateKey ? extended.privateKey : Buffer.from('')
    );
    return {
      address: secret.get_address().to_base58(NETWORK_TYPE),
      path: path,
    };
  };

  generateMultiSigAddressFromAddresses = (
    publicKeys: Array<string>,
    minSig: number,
    network_type: NetworkType
  ) => {
    let ergoTree = '10' + uint8_vlq(publicKeys.length + 1);
    ergoTree += '04' + int8_vlq(minSig);
    publicKeys.sort().forEach((item) => (ergoTree += '08cd' + item));
    ergoTree += '987300';
    ergoTree += `83${uint8_vlq(publicKeys.length)}08`; // add coll operation
    Array(publicKeys.length)
      .fill('')
      .forEach((item, index) => (ergoTree += '73' + uint8_vlq(index + 1)));
    return wasm.Address.recreate_from_ergo_tree(
      wasm.ErgoTree.from_base16_bytes(ergoTree)
    ).to_base58(network_type.prefix);
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

  createMultiSigWallet = async (
    name: string,
    walletId: number,
    keys: Array<string>,
    minSig: number
  ) => {
    const wallet = await WalletDbAction.getWalletById(walletId);
    if (wallet) {
      const is_derivable =
        !!wallet.extended_public_key && !is_valid_address(keys[0]);
      const createdWallet = await WalletDbAction.createWallet(
        name,
        WalletType.MultiSig,
        `${minSig}`,
        is_derivable ? wallet.extended_public_key : '',
        wallet.network_type
      );
      await MultiSigDbAction.createKey(
        createdWallet,
        wallet.extended_public_key,
        wallet
      );
      for (const key of keys) {
        const base58 = get_base58_extended_public_key(key);
        if (base58) {
          await MultiSigDbAction.createKey(createdWallet, base58, null);
        } else {
          throw Error('unreachable');
        }
      }
      await AddressAction.addWalletAddresses(createdWallet);
      store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
    }
  };

  loadWallets = async () => {
    if (!(store.getState().wallet as WalletStateType).walletValid) {
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
const MultiSigAction = new MultiSigActionClass();

export { AssetAction, WalletAction, AddressAction, MultiSigAction };
