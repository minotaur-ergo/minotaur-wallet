import Wallet, { WalletType } from '../db/entities/Wallet';
import { store } from '../store';
import * as actionTypes from '../store/actionType';
import { mnemonicToSeedSync } from 'bip39';
import { bip32, get_base58_extended_public_key, int8_vlq, is_valid_address, uint8_vlq } from '../util/util';
import { decrypt, encrypt } from './enc';
import { AddressDbAction, AssetDbAction, MultiSigDbAction, WalletDbAction } from './db';
import * as wasm from 'ergo-lib-wasm-browser';
import Address from '../db/entities/Address';
import { getNetworkType, NetworkType } from '../util/network_type';

const RootPathWithoutIndex = 'm/44\'/429\'/0\'/0';
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

class AddressActionClass {
    addWalletAddresses = async (wallet: Wallet) => {
        const deriveAddressAtIndex = async (index: number) => {
            if(wallet.type === WalletType.MultiSig){
                return await this.deriveMultiSigWalletAddress(wallet, index)
            }else{
                return await this.deriveAddress(wallet.extended_public_key, network_type.prefix, index)
            }
        }
        const network_type = getNetworkType(wallet.network_type);
        let addressObject = await deriveAddressAtIndex(0);
        await AddressDbAction.saveAddress(wallet, 'Main Address', addressObject.address, addressObject.path, 0);
        try {
            let index = 1;
            while (true) {
                addressObject = await deriveAddressAtIndex(index);
                const explorer = getNetworkType(wallet.network_type).getExplorer();
                const txs = (await explorer.getTxsByAddress(addressObject.address, { offset: 0, limit: 1 }));
                if (txs.total > 0) {
                    await AddressDbAction.saveAddress(wallet, `Derived Address ${index}`, addressObject.address, addressObject.path, index);
                } else {
                    break;
                }
                index++;
            }
        } catch (e) {

        }
    };

    deriveMultiSigWalletAddress = async (wallet: Wallet, index?:number) => {
        const walletKey = await MultiSigDbAction.getWalletInternalKey(wallet.id);
        const keys = await MultiSigDbAction.getWalletExternalKeys(wallet.id);
        if(index === undefined) {
            index = (await AddressDbAction.getLastAddress(wallet.id)) + 1;
        }
        const extended_keys = [...keys.map(item => item.extended_key)];
        if(walletKey) extended_keys.push(walletKey.extended_public_key)
        const pub_keys = extended_keys.map(key => {
            const pub = bip32.fromBase58(key);
            const derived1 = pub.derive(index!);
            return derived1.publicKey.toString('hex');
        });
        const address = this.generateMultiSigAddressFromAddresses(pub_keys, parseInt(wallet.seed), getNetworkType(wallet.network_type));
        const path = calcPathFromIndex(index!);
        return {
            address: address,
            path: path,
            index: index!
        };
    };

    deriveNewMultiSigWalletAddress = async (wallet: Wallet, name: string) => {
        const address = await this.deriveMultiSigWalletAddress(wallet);
        name = name ? name : await this.getNewAddressName(wallet.id, name);
        await AddressDbAction.saveAddress(wallet, name, address.address, address.path, address.index);
    }

    getWalletAddressSecret = async (wallet: Wallet, password: string, address: Address) => {
        const seed = decrypt(wallet.seed, password);
        const path = address.idx === -1 ? address.path : calcPathFromIndex(address.idx);
        const extended = bip32.fromSeed(seed).derivePath(path);
        return wasm.SecretKey.dlog_from_bytes(Uint8Array.from(extended.privateKey!));
    };

    deriveAddress = async (extended_public_key: string, NETWORK_TYPE: wasm.NetworkPrefix, index: number) => {
        const pub = bip32.fromBase58(extended_public_key);
        const derived1 = pub.derive(index);
        const address = wasm.Address.from_public_key(Uint8Array.from(derived1.publicKey));
        const path = calcPathFromIndex(index);
        return {
            address: address.to_base58(NETWORK_TYPE),
            path: path,
        };
    };

    deriveAddressFromMnemonic = async (mnemonic: string, password: string, NETWORK_TYPE: wasm.NetworkPrefix, index: number) => {
        const seed = mnemonicToSeedSync(mnemonic, password);
        const path = calcPathFromIndex(index);
        const extended = bip32.fromSeed(seed).derivePath(path);
        const secret = wasm.SecretKey.dlog_from_bytes(Buffer.from(extended.privateKey!));
        return {
            address: secret.get_address().to_base58(NETWORK_TYPE),
            path: path,
        };
    };

    generateMultiSigAddressFromAddresses = (publicKeys: Array<string>, minSig: number, network_type: NetworkType) => {
        let ergoTree = '10' + uint8_vlq(publicKeys.length + 1);
        ergoTree += '04' + int8_vlq(minSig);
        publicKeys.sort().forEach(item => ergoTree += '08cd' + item);
        ergoTree += '987300';
        ergoTree += `83${uint8_vlq(publicKeys.length)}08`; // add coll operation
        Array(publicKeys.length).fill('').forEach((item, index) => ergoTree += '73' + uint8_vlq(index + 1));
        return wasm.Address.recreate_from_ergo_tree(wasm.ErgoTree.from_base16_bytes(ergoTree)).to_base58(network_type.prefix);
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
        const index = await AddressDbAction.getLastAddress(wallet.id) + 1;
        name = name ? name : await this.getNewAddressName(wallet.id, name);
        const address = await this.deriveAddress(wallet.extended_public_key, network_type.prefix, index ? index : 0);
        await AddressDbAction.saveAddress(wallet, name, address.address, address.path, index ? index : 0);
    };

    deriveReadOnlyAddress = async (wallet: Wallet, address: string, name: string) => {
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
    createWallet = async (name: string, type: WalletType, mnemonic: string, password: string, network_type: string, encryptionPassword: string) => {
        const seed = mnemonicToSeedSync(mnemonic, password);
        const master = bip32.fromSeed(seed);
        const extended_public_key = master.derivePath(RootPathWithoutIndex).neutered();
        const storedSeed = encryptionPassword ? encrypt(seed, encryptionPassword) : seed.toString('hex');
        const wallet = await WalletDbAction.createWallet(name, type, storedSeed, extended_public_key.toBase58(), network_type);
        await AddressAction.addWalletAddresses(wallet);
        store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
    };

    createReadOnlyWallet = async (name: string, address: string, network_type: string) => {
        const walletEntity = await WalletDbAction.createWallet(name, WalletType.ReadOnly, ' ', ' ', network_type);
        await AddressDbAction.saveAddress(walletEntity, 'Main Address', address, '--', 0);
        store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
    };

    createExtendedReadOnlyWallet = async (name: string, extended_public_key: string, network_type: string) => {
        const wallet = await WalletDbAction.createWallet(name, WalletType.ReadOnly, ' ', extended_public_key, network_type);
        await AddressAction.addWalletAddresses(wallet);
        store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
    };

    createMultiSigWallet = async (name: string, walletId: number, keys: Array<string>, minSig: number) => {
        const wallet = await WalletDbAction.getWalletById(walletId);
        if (wallet) {
            const is_derivable = !!wallet.extended_public_key && !is_valid_address(keys[0]);
            const createdWallet = await WalletDbAction.createWallet(
                name,
                WalletType.MultiSig,
                `${minSig}`,
                is_derivable ? wallet.extended_public_key : '',
                wallet.network_type,
            );
            await MultiSigDbAction.createKey(createdWallet, wallet.extended_public_key, wallet);
            for (let key of keys) {
                const base58 = get_base58_extended_public_key(key)
                if(base58) {
                    await MultiSigDbAction.createKey(createdWallet, base58, null);
                }else{
                    throw Error("unreachable")
                }
            }
            await AddressAction.addWalletAddresses(createdWallet)
            store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
        }
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

export {
    AssetAction,
    WalletAction,
    AddressAction,
};
