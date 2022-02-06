import { getConnection } from "typeorm";
import Block from "../entities/Block";

const getBlockRepository = () => getConnection().getRepository(Block);

const getLastHeaders = async () => {
    return getBlockRepository().find()
};

const InsertHeader = async (id: string, height: number, network_type: string) => {
    const entity = {
        block_id: id,
        height: height,
        network_type: network_type,
    }
    await getBlockRepository().insert(entity);
}
const forkHeaders = async (height: number, network_type: string) => {
    return getBlockRepository()
        .createQueryBuilder()
        .where("height >= :height", {height: height})
        .andWhere('network_type = :network_type', {network_type: network_type})
        .delete()
        .execute()
}
const InsertHeaders = async (headers: Array<{id: string, height:number}>, network_type: string) => {
    const entities = headers.map(item => ({block_id: item.id, height: item.height, network_type: network_type}));
    await getBlockRepository().insert(entities);
}

export {
    getLastHeaders,
    InsertHeader,
    InsertHeaders,
    forkHeaders,
};
