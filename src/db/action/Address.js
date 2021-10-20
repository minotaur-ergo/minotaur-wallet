import { getConnection } from "typeorm";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import * as wasm from "ergo-lib-wasm-browser";
import { store } from "../../store";
import * as actionTypes from "../../store/actionType";

const getAddressRepository = () => getConnection().getRepository("Address")

const calcPathFromIndex = index => `m/44'/429'/0'/0/${index}`

const deriveAddress = async (wallet, mnemonic, password, index, name) => {
    console.log(password)
    const seed = mnemonicToSeedSync(mnemonic, password)
    const path = calcPathFromIndex(index)
    const extended = fromSeed(seed).derivePath(path);
    const secret = wasm.SecretKey.dlog_from_bytes(extended.privateKey);
    const addressStr = secret.get_address().to_base58(wasm.NetworkPrefix.Testnet)
    const address = {
        name: name,
        address: addressStr,
        path: path,
        index: index,
        last_height: 0,
        last_update: 0,
        wallet: wallet
    }
    return  await (getAddressRepository().save(address));
}

const validateWalletPassword = async (wallet, password) => {
    try {
        const seed = mnemonicToSeedSync(wallet.mnemonic, password)
        const extended = fromSeed(seed).derivePath(calcPathFromIndex(0));
        const secret = wasm.SecretKey.dlog_from_bytes(extended.privateKey);
        const addressStr = secret.get_address().to_base58(wasm.NetworkPrefix.Testnet)
        const MainAddress = await getAddressRepository().find({wallet: wallet.id, index: 0})
        if (MainAddress.length > 0) {
            return MainAddress[0].address === addressStr
        }
        return false
    }catch (e){
        return false;
    }
}

const deriveNewAddress = async (wallet, password, name) => {
    const index = await getLastAddress(wallet.id)
    await deriveAddress(wallet, wallet.mnemonic, password, index + 1, name);
    store.dispatch({type: actionTypes.INVALIDATE_ADDRESS})
}

const getLastAddress = async wallet_id => {
    const queryBuilder = getAddressRepository().createQueryBuilder("lastIndex");
    queryBuilder.select("MAX(\"index\")", "lastIndex");//.where(`walletId=${wallet_id}`)
    const res = await queryBuilder.getRawOne()
    return res === undefined ? 0 : res.lastIndex;
}


const loadWalletAddress = async (wallet_id) => {
    const addresses = await (getAddressRepository().find({wallet:wallet_id}));
    store.dispatch({type: actionTypes.SET_ADDRESS, payload: {address:addresses, wallet: wallet_id}});
}

export {
    getLastAddress,
    deriveAddress,
    loadWalletAddress,
    validateWalletPassword,
    deriveNewAddress,
}
