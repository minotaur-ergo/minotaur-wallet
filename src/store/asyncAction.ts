import { REFRESH_INTERVAL } from "../util/const";
import { NETWORK_TYPES } from "../util/network_type";
import { AddressDbAction, AssetDbAction, BoxContentDbAction, BoxDbAction } from "../action/db";
import { BlockChainAction, BlockChainTxAction } from "../action/blockchain";
import { store } from "./index";
import * as actionType from './actionType'
import { ErgoBox } from "../util/network/models";
import { JsonBI } from "../util/json";

const loadTokensAsync = async (network_type: string) => {
    try {
        const tokens = await BoxContentDbAction.getTokens(network_type);
        const assets = (await AssetDbAction.getAllAsset(network_type)).map(item => item.asset_id);
        for (let token of tokens) {
            if (assets.indexOf(token) === -1) {
                await BlockChainAction.updateTokenInfo(token, network_type);
            }
        }
    } catch (e) {

    }
};

const validateBoxContentModel = async () => {
    const invalidBoxes = await BoxDbAction.invalidAssetCountBox()
    for(let box of invalidBoxes){
        const boxEntity = await BoxDbAction.getBoxById(box.id);
        if (boxEntity) {
            const boxJson: ErgoBox = JsonBI.parse(boxEntity.json)
            for (let token of boxJson.assets) {
                await BoxContentDbAction.createOrUpdateBoxContent(boxEntity, token);
            }
        }

    }
}

const loadBlockChainDataAsync = async () => {
    try {
        for (const NETWORK_TYPE of NETWORK_TYPES) {
            const addresses = await AddressDbAction.getAllAddressOfNetworkType(NETWORK_TYPE.label);
            if (addresses.length > 0) {
                const node = NETWORK_TYPE.getNode();
                const height = await node.getHeight();
                // find new headers from blockchain and insert headers to database
                await BlockChainAction.calcForkPoint(height, NETWORK_TYPE);
                try {
                    for (let address of addresses) {
                        store.dispatch({type: actionType.SET_LOADING_WALLET, payload: address.wallet?.id})
                        await BlockChainTxAction.getMinedTxForAddress(address);
                    }
                    await loadTokensAsync(NETWORK_TYPE.label)
                    // fix database
                    await validateBoxContentModel();
                    store.dispatch({type: actionType.INVALIDATE_WALLETS, payload: {removeLoadingWallet: true}});
                } catch (e) {
                    console.log(e)
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};

const loadBlockChainData = () => {
    loadBlockChainDataAsync().then(() => {
        store.dispatch({type: actionType.INVALIDATE_WALLETS});
        setTimeout(() => loadBlockChainData(), REFRESH_INTERVAL)
    });
};


export {
    loadBlockChainData
};
