import * as dbAssetAction from "../db/action/asset";
import { getExplorer } from "../network/explorer";

const updateTokenInfo = async (tokenId: string, network_type: string) => {
    const info = await getExplorer(network_type).getFullTokenInfo(tokenId);
    if (info) {
        await dbAssetAction.createOrUpdateAsset(info, network_type);
    }
};

export {
    updateTokenInfo
};
