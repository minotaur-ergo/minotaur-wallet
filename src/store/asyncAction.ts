import { store } from ".";
import * as dbAddressAction from "../db/action/address";
import * as actionType from "./actionType";
import { getMinedTxForAddress, processAddressInputBoxes, processAddressOutputBoxes } from "../action/transaction";
import { getTokens } from "../db/action/boxContent";
import { getAllAsset } from "../db/action/asset";
import { updateTokenInfo } from "../action/asset";
import { REFRESH_INTERVAL } from "../config/const";
import { calcForkPoint } from "../action/block";
import { NETWORK_TYPES } from "../config/network_type";

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
            const addresses = await dbAddressAction.getSyncingAddresses(NETWORK_TYPE.label);
            if(addresses.length > 0) {
                const node = NETWORK_TYPE.getNode();
                const height = await node.getHeight();
                // find new headers from blockchain and insert headers to database
                const forkPointDetail = await calcForkPoint(height, NETWORK_TYPE);
                const forkPoint = forkPointDetail.height;
                const blocks = forkPointDetail.blocks;
                try {
                    for (let address of addresses) {
                        if (forkPoint <= height || address.tx_load_height < height) {
                            await getMinedTxForAddress(address, forkPoint, blocks);
                        }
                        await processAddressOutputBoxes(address, height);
                        await processAddressInputBoxes(address, height);
                    }
                    await loadTokensAsync(NETWORK_TYPE.label);
                    // process tx inputs and outputs.
                    store.dispatch({ type: actionType.INVALIDATE_WALLETS });
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
    loadBlockChainDataAsync().then(() => setTimeout(() => loadBlockChainData(), REFRESH_INTERVAL));
};


export {
    loadBlockChainData
};
