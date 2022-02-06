import { getConnection } from "typeorm";
import Asset from "../entities/Asset";
import { TokenInfo } from "../../network/models";

const getAssetRepository = () => getConnection().getRepository(Asset);


const getAssetByAssetId = async (assetId: string, network_type: string) => {
    return await getAssetRepository().findOne({ asset_id: assetId, network_type: network_type });
};

const createOrUpdateAsset = async (info: TokenInfo, network_type: string) => {
    const dbEntity = await getAssetByAssetId(info.id, network_type);
    const entity = {
        asset_id: info.id,
        box_id: info.boxId,
        name: info.name,
        network_type: network_type,
        description: info.description,
        decimal: info.decimals
    };
    if (dbEntity) {
        await getAssetRepository().createQueryBuilder().update().set(entity).where("id=:id", { id: dbEntity.id }).execute();
    } else {
        await getAssetRepository().insert(entity);
    }
    return await getAssetByAssetId(info.id, network_type);
};

const getAllAsset = async (network_type: string) => {
    return await getAssetRepository().find({ network_type: network_type });
};

export {
    getAssetByAssetId,
    createOrUpdateAsset,
    getAllAsset
};
