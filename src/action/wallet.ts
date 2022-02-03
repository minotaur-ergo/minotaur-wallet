import * as dbWalletAction from '../db/action/wallet';
import * as dbAddressAction from '../db/action/address';
import { WalletType } from '../db/entities/Wallet';
import { store } from '../store';
import * as actionTypes from '../store/actionType';
import * as addressActions from './address';

const createWallet = async (name: string, type: WalletType, mnemonic: string, password: string) => {
    const wallet = await dbWalletAction.createWallet(name, type, mnemonic);
    await addressActions.addWalletAddresses(wallet, mnemonic, password);
    store.dispatch({ type: actionTypes.INVALIDATE_WALLETS });
};

const createReadOnlyWallet = async (name: string, address: string) => {
    const walletEntity = await dbWalletAction.createWallet(name, WalletType.ReadOnly, ' ');
    await dbAddressAction.saveAddress(walletEntity, 'Main Address', address, '--', 0);
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
};
