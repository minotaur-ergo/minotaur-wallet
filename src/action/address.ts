import * as dbAddressAction from "../db/action/address";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import * as wasm from "ergo-lib-wasm-browser";
import { NETWORK_TYPE } from "../config/const";
import Wallet from "../db/entities/Wallet";
import explorer from "../network/explorer";
import Address from "../db/entities/Address";

const calcPathFromIndex = (index: number) => `m/44'/429'/0'/0/${index}`;

const addWalletAddresses = async (wallet: Wallet, mnemonic: string, password: string) => {
    let addressObject = await deriveAddress(mnemonic, password, 0);
    let address = await dbAddressAction.saveAddress(wallet, "Main Address", addressObject.address, addressObject.path, 0);
    try {
        let address2 = await dbAddressAction.getAddress(address.identifiers[0].id);
        console.log(address2);
        let index = 1;
        while (true) {
            addressObject = await deriveAddress(mnemonic, password, index);
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
    const tou8 = require("buffer-to-uint8array");
    const seed = mnemonicToSeedSync(wallet.mnemonic, password);
    const path = address.idx === -1 ? address.path : calcPathFromIndex(address.idx);
    const extended = fromSeed(seed).derivePath(path);
    return wasm.SecretKey.dlog_from_bytes(tou8(extended.privateKey));
};

const deriveAddress = async (mnemonic: string, password: string, index: number) => {
    const tou8 = require("buffer-to-uint8array");
    const seed = mnemonicToSeedSync(mnemonic, password);
    const path = calcPathFromIndex(index);
    const extended = fromSeed(seed).derivePath(path);
    const secret = wasm.SecretKey.dlog_from_bytes(tou8(extended.privateKey));
    return {
        address: secret.get_address().to_base58(NETWORK_TYPE),
        path: path
    };
};

const deriveNewAddress = async (wallet: Wallet, password: string, name: string) => {
    const index = await dbAddressAction.getLastAddress(wallet.id) + 1;
    const address = await deriveAddress(wallet.mnemonic, password, index ? index : 0);
    await dbAddressAction.saveAddress(wallet, name, address.address, address.path, index ? index : 0);
};

const deriveReadOnlyAddress = async (wallet: Wallet, address: string, name: string) => {
    await dbAddressAction.saveAddress(wallet, name, address, "no-path", -1);
};

const validatePassword = async (wallet: Wallet, password: string, address: string, index: number) => {
    const derivedAddress = await deriveAddress(wallet.mnemonic, password, index);
    return derivedAddress.address === address;
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
    addWalletAddresses,
    getAddress,
    getWalletAddresses,
    validatePassword,
    deriveNewAddress,
    updateAddressName,
    getWalletAddressSecret,
    deriveReadOnlyAddress
};
