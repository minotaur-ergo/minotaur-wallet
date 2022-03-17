import * as dbWalletAction from '../db/action/wallet';
import * as dbAddressAction from '../db/action/address';
import { WalletType } from '../db/entities/Wallet';
import { store } from '../store';
import * as actionTypes from '../store/actionType';
import * as addressActions from './address';
import { mnemonicToSeedSync } from "bip39";
import { RootPathWithoutIndex } from "./address";
import { fromSeed } from "bip32";
import { encrypt } from "./enc";

const createWallet = async (name: string, type: WalletType, mnemonic: string, password: string, network_type: string, encryptionPassword: string) => {
    const seed = mnemonicToSeedSync(mnemonic, password)
    const master = fromSeed(seed);
    const extended_public_key = master.derivePath(RootPathWithoutIndex).neutered();
    const storedSeed = encryptionPassword ? encrypt(seed, encryptionPassword) : seed.toString("hex");
    const wallet = await dbWalletAction.createWallet(name, type, storedSeed, extended_public_key.toBase58(), network_type);
    await addressActions.addWalletAddresses(wallet);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
};

const createReadOnlyWallet = async (name: string, address: string, network_type: string) => {
    const walletEntity = await dbWalletAction.createWallet(name, WalletType.ReadOnly, ' ', ' ', network_type);
    await dbAddressAction.saveAddress(walletEntity, 'Main Address', address, '--', 0);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
};

const createExtendedReadOnlyWallet = async (name: string, extended_public_key: string, network_type: string) => {
    const wallet = await dbWalletAction.createWallet(name, WalletType.ReadOnly, ' ', extended_public_key, network_type);
    await addressActions.addWalletAddresses(wallet);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
};

const loadWallets = async () => {
    if (!store.getState().wallet.walletValid) {
        const wallets = await dbWalletAction.getWallets();
        store.dispatch({ type: actionTypes.SET_WALLETS, payload: await (wallets) });
    }
};


export {
    createWallet,
    loadWallets,
    createReadOnlyWallet,
    createExtendedReadOnlyWallet,
};
