import { getConnection } from "typeorm";
import BoxContent from "../entities/BoxContent";
import Box from "../entities/Box";
import { BoxAsset } from "../../network/models";
import TokenWithAddress from "../entities/views/AddressToken";

const getBoxContentRepository = () => getConnection().getRepository(BoxContent);
const getTokenWithAddressRepository = () => getConnection().getRepository(TokenWithAddress);

const createOrUpdateBoxContent = async (box: Box, asset: BoxAsset) => {
    const dbEntity = await getBoxToken(box, asset.tokenId);
    const entity = {
        token_id: asset.tokenId,
        box: box,
        network_type: box.network_type,
        amount: BigInt(asset.amount)
    };
    if (dbEntity) {
        await getBoxContentRepository().createQueryBuilder().update().set(
            entity
        ).where("id=:id", { id: dbEntity.id }).execute();
    } else {
        await getBoxContentRepository().save(entity);
    }
};

const getBoxToken = async (box: Box, token_id: string) => {
    return await getBoxContentRepository().findOne({ box: box, token_id: token_id });
};

const getTokens = async (network_type: string) => {
    return (await getBoxContentRepository()
        .createQueryBuilder()
        .select("token_id", "tokenId")
        .innerJoin("box", "Box", "Box.id=boxId")
        .where("network_type = :network_type", { network_type: network_type })
        .addGroupBy("token_id")
        .getRawMany()).map((item: { tokenId: string }) => item.tokenId);
};

const getAddressTokens = async (addressId: number) => {
    return (await getBoxContentRepository()
        .createQueryBuilder()
        .select("token_id", "tokenId")
        .addSelect("SUM(amount)", "total")
        .innerJoin("box", "Box", "Box.id=boxId")
        .where("Box.addressId = :addressId", { addressId: addressId })
        .addGroupBy("token_id")
        .getRawMany()).map((item: { tokenId: string, total: string }) => item.tokenId);
};

const getWalletTokens = async (walletId: number) => {
    return (await getBoxContentRepository()
        .createQueryBuilder()
        .select("token_id", "tokenId")
        .addSelect("CAST(SUM(CAST(amount AS INT)) AS TEXT)", "total")
        .innerJoin("box", "Box", "Box.id=boxId")
        .innerJoin("address", "Address", "Box.addressId=Address.id")
        .where("Address.walletId = :walletId and Box.spendTxId IS NULL", { walletId: walletId })
        .addGroupBy("token_id")
        .getRawMany<{ tokenId: string, total: string }>());
};

const forkBoxContents = async (height: number, network_type: string) => {
    await getBoxContentRepository().remove(await getBoxContentRepository()
        .createQueryBuilder()
        .innerJoin("box", "Box")
        .where("create_height >= :height", { height: height })
        .andWhere("network_type=:network_type", { network_type: network_type })
        .getMany());
};

const getTokenWithAddressForWallet = async (walletId: number) => {
    return await getTokenWithAddressRepository().find({ wallet_id: walletId });
};

const getSingleTokenWithAddressForWallet = async (walletId: number, tokenId: string) => {
    return await getTokenWithAddressRepository().find({ wallet_id: walletId, token_id: tokenId });
};

export {
    createOrUpdateBoxContent,
    getBoxToken,
    getTokens,
    getAddressTokens,
    getWalletTokens,
    forkBoxContents,
    getTokenWithAddressForWallet,
    getSingleTokenWithAddressForWallet
};
