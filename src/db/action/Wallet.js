import { getConnection } from "typeorm";
import { deriveAddress } from "./Address";
import { store } from "../../store";
import * as actionTypes from '../../store/actionType'
const getWalletRepository = () => getConnection().getRepository("Wallet")

const createWallet = async (name, type, mnemonic, password) => {
    const wallet = {
        name: name,
        type: type,
        mnemonic: mnemonic
    }
    const savedWallet = await getWalletRepository().save(wallet);
    await deriveAddress(savedWallet, mnemonic, password, 0, "Main Address");
    // derive other addresses with any transaction
    store.dispatch({type: actionTypes.INVALIDATE_WALLETS});
}

const loadWallet = async () => {
    store.dispatch({type: actionTypes.SET_WALLETS, payload: await (getWalletRepository().find())});
}


export {
    createWallet,
    loadWallet,
}
