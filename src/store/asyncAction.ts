import { store } from ".";
import * as dbAddressAction from "../db/action/address";
import * as actionType from "./actionType";
import { getMinedTxForAddress } from "../action/transaction";
import { getTokens } from "../db/action/boxContent";
import { getAllAsset } from "../db/action/asset";
import { updateTokenInfo } from "../action/asset";
import { REFRESH_INTERVAL } from "../config/const";
import node from "../network/node";
import { calcForkPoint } from "../action/block";

const loadTokensAsync = async () => {
    try {
        const tokens = await getTokens();
        const assets = (await getAllAsset()).map(item => item.asset_id);
        for(let token of tokens){
            if(assets.indexOf(token) === -1){
                await updateTokenInfo(token);
            }
        }
    } catch (e) {

    }
};

const loadBlockChainDataAsync = async () => {
    try {
        const height = await node.getHeight();
        const forkPointDetail = await calcForkPoint(height);
        const forkPoint = forkPointDetail.height
        const blocks = forkPointDetail.blocks
        if (forkPoint < height) {
            try {
                const addresses = await dbAddressAction.getSyncingAddresses();
                for (let address of addresses) {
                    await getMinedTxForAddress(address, forkPoint, blocks);
                }
                await loadTokensAsync();
                store.dispatch({ type: actionType.INVALIDATE_WALLETS });
            } catch (e) {

            }
        }
    }catch (e) {
        console.log(e)
    }
}

const loadBlockChainData = () => {
    loadBlockChainDataAsync().then(() => setTimeout(() => loadBlockChainData(), REFRESH_INTERVAL))
};


export {
    loadBlockChainData
};
