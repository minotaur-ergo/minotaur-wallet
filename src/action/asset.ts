import * as dbAssetAction from "../db/action/asset";
import { getNetworkType } from "../config/network_type";

const updateTokenInfo = async (tokenId: string, network_type: string) => {
    const explorer = getNetworkType(network_type).getExplorer()
    const info = await explorer.getFullTokenInfo(tokenId);
    if (info) {
        await dbAssetAction.createOrUpdateAsset(info, network_type);
    }
};

export {
    updateTokenInfo
};
