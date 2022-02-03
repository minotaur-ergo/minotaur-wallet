import { getConnection } from "typeorm";
import Block from "../entities/Block";

const getBlockRepository = () => getConnection().getRepository(Block);

const getLastHeaders = async () => {
    return getBlockRepository().find()
};

const InsertHeader = async (id: string, height: number) => {
    const entity = {
        block_id: id,
        height: height
    }
    await getBlockRepository().insert(entity);
}
const forkHeaders = async (height: number) => {
    return getBlockRepository()
        .createQueryBuilder()
        .where("height >= :height", {height: height})
        .delete()
        .execute()
}
const InsertHeaders = async (headers: Array<{id: string, height:number}>) => {
    const entities = headers.map(item => ({block_id: item.id, height: item.height}));
    await getBlockRepository().insert(entities);
}

export {
    getLastHeaders,
    InsertHeader,
    InsertHeaders,
    forkHeaders,
};
