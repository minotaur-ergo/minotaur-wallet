import { store } from ".";
import * as dbAddressAction from "../db/action/address";
import * as actionType from "./actionType";
import { getMinedTxForAddress } from "../action/transaction";
import { getTokens } from "../db/action/boxContent";
import { getAllAsset } from "../db/action/asset";
import { updateTokenInfo } from "../action/asset";
import { REFRESH_INTERVAL } from "../config/const";
import { calcForkPoint } from "../action/block";
import { NETWORK_TYPES } from "../config/network_type";
import { getNode } from "../network/node";

const loadTokensAsync = async (network_type: string) => {
    try {
        const tokens = await getTokens(network_type);
        const assets = (await getAllAsset(network_type)).map(item => item.asset_id);
        for (let token of tokens) {
            if (assets.indexOf(token) === -1) {
                await updateTokenInfo(token, network_type);
            }
        }
    } catch (e) {

    }
};

const loadBlockChainDataAsync = async () => {
    try {
        for (const NETWORK_TYPE of NETWORK_TYPES) {
            const node = getNode(NETWORK_TYPE.label);
            const height = await node.getHeight();
            const forkPointDetail = await calcForkPoint(height, NETWORK_TYPE.label);
            const forkPoint = forkPointDetail.height;
            const blocks = forkPointDetail.blocks;
            try {
                const addresses = await dbAddressAction.getSyncingAddresses(NETWORK_TYPE.label);
                for (let address of addresses) {
                    if (forkPoint <= height || address.is_new) {
                        await getMinedTxForAddress(address, forkPoint, blocks);
                    }
                }
                await loadTokensAsync(NETWORK_TYPE.label);
                store.dispatch({ type: actionType.INVALIDATE_WALLETS });
            } catch (e) {

            }
        }
    } catch (e) {
        console.log(e);
    }
};

const loadBlockChainData = () => {
    loadBlockChainDataAsync().then(() => setTimeout(() => loadBlockChainData(), REFRESH_INTERVAL));
};


export {
    loadBlockChainData
};
