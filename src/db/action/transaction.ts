import { ErgoTx } from "../../network/models";
import { getConnection } from "typeorm";
import Tx, { TxStatus } from "../entities/Tx";
import WalletTx from "../entities/views/WalletTx";
import { JsonBI } from "../../config/json";
const getTxRepository = () => getConnection().getRepository(Tx);
const getWalletTxRepository = () => getConnection().getRepository(WalletTx);

const updateOrCreateTx = async (tx: ErgoTx, status: TxStatus, network_type: string) => {
    const dbTx = await getTxByTxId(tx.id, network_type);
    const entity = {
        tx_id: tx.id,
        height: tx.inclusionHeight,
        date: tx.timestamp,
        status: status,
        network_type: network_type,
        json: JsonBI.stringify(tx)
    };
    if (dbTx) {
        await getTxRepository().createQueryBuilder().update().set(entity).where("id=:id", { id: dbTx.id }).execute();
        return { status: dbTx.status, tx: await getTxByTxId(tx.id, network_type) };
    } else {
        return { status: TxStatus.New, tx: await getTxRepository().save(entity) as Tx };
    }
};

const getTxByTxId = async (txId: string, network_type: string) => {
    return await getTxRepository().findOne({ tx_id: txId, network_type: network_type });
};

const getTxById = async (id: number) => {
    return await getTxRepository().findOne({ id: id });
};

const getWalletTx = async (wallet_id: number) => {
    return await getWalletTxRepository().find({ create_wallet_id: wallet_id });
};

const forkTxs = async (height: number, network_type: string) => {
    await getTxRepository()
        .createQueryBuilder()
        .where("height >= :height", {height: height})
        .andWhere('network_type = :network_type', {network_type: network_type})
        .delete()
        .execute()
}
export {
    updateOrCreateTx,
    getTxByTxId,
    getTxById,
    getWalletTx,
    forkTxs,
};
