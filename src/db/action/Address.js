import { getConnection } from "typeorm";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import * as wasm from "ergo-lib-wasm-browser";
import { store } from "../../store";

const getAddressRepository = () => getConnection().getRepository("Address")


const deriveAddress = async (wallet, mnemonic, password, index, name) => {
    const seed = mnemonicToSeedSync(mnemonic, password)
    const extended = fromSeed(seed).derive(index);
    const secret = wasm.SecretKey.dlog_from_bytes(extended.privateKey);
    const addressStr = secret.get_address().to_base58(wasm.NetworkPrefix.Testnet)
    const address = {
        name: name,
        address: addressStr,
        path: 'no-path',
        last_height: 0,
        last_update: 0,
        wallet: wallet
    }
    return  await (getAddressRepository().save(address));
}

const getLastAddress = async wallet_id => {
    const queryBuilder = getAddressRepository().createQueryBuilder("lastIndex");
    queryBuilder.select("MAX(index)", "lastIndex").where(`wallet=${wallet_id}`)
    const res = await queryBuilder.getOne()
    return res;
}

const loadWalletAddress = async (wallet_id) => {
    return await getAddressRepository().find({wallet:wallet_id})
}
export {
    getLastAddress,
    deriveAddress,
    loadWalletAddress
}
