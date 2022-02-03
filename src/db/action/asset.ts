import { getConnection } from "typeorm";
import Asset from "../entities/Asset";
import { TokenInfo } from "../../network/models";
import { getBoxByBoxId } from "./box";

const getAssetRepository = () => getConnection().getRepository(Asset);


const getAssetByAssetId = async (assetId: string) => {
    return await getAssetRepository().findOne({ asset_id: assetId });
};

const createOrUpdateBox = async (info: TokenInfo) => {
    const dbEntity = await getAssetByAssetId(info.id);
    const entity = {
        asset_id: info.id,
        box_id: info.boxId,
        name: info.name,
        description: info.description,
        decimal: info.decimals
    };
    if (dbEntity) {
        await getAssetRepository().createQueryBuilder().update().set(entity).where('id=:id', {id: dbEntity.id}).execute();
    } else {
        await getAssetRepository().insert(entity);
    }
    return await getBoxByBoxId(info.id);
};

const getAllAsset = async () => {
    return await getAssetRepository().find()
}

export {
    getAssetByAssetId,
    createOrUpdateBox,
    getAllAsset,
}
