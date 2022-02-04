import * as dbAddressAction from "../db/action/address";
import { fromBase58, fromSeed } from "bip32";
import * as wasm from "ergo-lib-wasm-browser";
import { NETWORK_TYPE } from "../config/const";
import Wallet from "../db/entities/Wallet";
import explorer from "../network/explorer";
import Address from "../db/entities/Address";
import { decrypt } from "./enc";
import { mnemonicToSeedSync } from "bip39";

const RootPathWithoutIndex = "m/44'/429'/0'/0"
const calcPathFromIndex = (index: number) => `${RootPathWithoutIndex}/${index}`;

const addWalletAddresses = async (wallet: Wallet) => {
    let addressObject = await deriveAddress(wallet.extended_public_key, 0);
    try {
        let index = 1;
        while (true) {
            addressObject = await deriveAddress(wallet.extended_public_key, index);
            const txs = (await explorer.getTxsByAddress(addressObject.address, { offset: 0, limit: 1 }));
            if (txs.total > 0) {
                await dbAddressAction.saveAddress(wallet, `Derive Address ${index}`, addressObject.address, addressObject.path, index);
            } else {
                break;
            }
            index++;
        }
    } catch (e) {

    }
};

const getWalletAddressSecret = async (wallet: Wallet, password: string, address: Address) => {
    const seed = decrypt(wallet.seed, password)
    const path = address.idx === -1 ? address.path : calcPathFromIndex(address.idx);
    const extended = fromSeed(seed).derivePath(path);
    return wasm.SecretKey.dlog_from_bytes(Uint8Array.from(extended.privateKey!));
};

const deriveAddress = async (extended_public_key: string, index: number) => {
    const pub = fromBase58(extended_public_key);
    const derived1 = pub.derive(index);
    const address = wasm.Address.from_public_key(Uint8Array.from(derived1.publicKey));
    const path = calcPathFromIndex(index);
    return {
        address: address.to_base58(NETWORK_TYPE),
        path: path
    };
};

const deriveAddressFromMnemonic = async (mnemonic: string, password: string, index: number) => {
    const seed = mnemonicToSeedSync(mnemonic, password);
    const path = calcPathFromIndex(index);
    const extended = fromSeed(seed).derivePath(path);
    const secret = wasm.SecretKey.dlog_from_bytes(Buffer.from(extended.privateKey!));
    return {
        address: secret.get_address().to_base58(NETWORK_TYPE),
        path: path
    };
};

const deriveNewAddress = async (wallet: Wallet, name: string) => {
    const index = await dbAddressAction.getLastAddress(wallet.id) + 1;
    const address = await deriveAddress(wallet.extended_public_key, index ? index : 0);
    await dbAddressAction.saveAddress(wallet, name, address.address, address.path, index ? index : 0);
};

const deriveReadOnlyAddress = async (wallet: Wallet, address: string, name: string) => {
    await dbAddressAction.saveAddress(wallet, name, address, "no-path", -1);
};

const validatePassword = async (wallet: Wallet, password: string, address: string, index: number) => {
    const seed = decrypt(wallet.seed, password)
    const master = fromSeed(seed).derivePath(calcPathFromIndex(index));
    const secret = wasm.SecretKey.dlog_from_bytes(Uint8Array.from(master.privateKey!))
    return secret.get_address().to_base58(NETWORK_TYPE) === address;
};

const getAddress = async (addressId: number) => {
    return await dbAddressAction.getAddress(addressId);
};

const getWalletAddresses = async (walletId: number) => {
    return dbAddressAction.getWalletAddresses(walletId);
};

const updateAddressName = async (walletId: number, newName: string) => {
    return dbAddressAction.updateAddressName(walletId, newName);
};
export {
    deriveAddress,
    deriveAddressFromMnemonic,
    addWalletAddresses,
    getAddress,
    getWalletAddresses,
    validatePassword,
    deriveNewAddress,
    updateAddressName,
    getWalletAddressSecret,
    deriveReadOnlyAddress,
    calcPathFromIndex,
    RootPathWithoutIndex
};
