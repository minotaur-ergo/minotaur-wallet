import explorer from "../network/explorer";
import * as dbAssetAction from "../db/action/asset";

const updateTokenInfo = async (tokenId: string) => {
    const info = await explorer.getFullTokenInfo(tokenId);
    if (info) {
        await dbAssetAction.createOrUpdateBox(info);
    }
};

export {
    updateTokenInfo
};
