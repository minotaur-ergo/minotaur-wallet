import { forkHeaders, getLastHeaders, InsertHeaders } from "../db/action/block";
import { Paging } from "../network/paging";
import { CONFIRMATION_HEIGHT } from "../config/const";
import { forkBoxContents } from "../db/action/boxContent";
import { forkBoxes } from "../db/action/box";
import { forkTxs } from "../db/action/transaction";
import { NetworkType } from "../config/network_type";

const pageSize: number = 20;

const processResult = async (height: number, dbHeight: number, forkPoint: number, blocks: { [height: number]: string }, network_type: string) => {
    if(dbHeight > forkPoint || dbHeight === 0) {
        try {
            await forkBoxContents(forkPoint, network_type);
            await forkBoxes(height, network_type);
            await forkTxs(height, network_type);
            await forkHeaders(height, network_type);
            await InsertHeaders(Object.entries(blocks).map(value => {
                return { id: value[1], height: Number(value[0]) };
            }), network_type);
        } catch (e) {
            return { height: height, blocks: {} };
        }
    }
    return { height: forkPoint, blocks: blocks };
};

const calcForkPoint = async (height: number, network_type: NetworkType): Promise<{ height: number, blocks: { [height: number]: string } }> => {
    let needProcessBlocks: { [height: number]: string } = {};
    let forkPoint = 0;
    const dbBlocks: { [height: number]: string } = {};
    (await getLastHeaders()).forEach(item => dbBlocks[item.height] = item.block_id);
    const dbHeight = Math.max(...Object.keys(dbBlocks).map(item => Number(item)));
    let paging: Paging = { offset: 0, limit: 2 };
    let minHeight: number = height;
    while (minHeight > height - CONFIRMATION_HEIGHT) {
        const chunkHeaders = (await network_type.getExplorer().getBlocksHeaders(paging)).items;
        chunkHeaders.sort((a, b) => b.height - a.height);
        for (let index = 0; index < chunkHeaders.length; index++) {
            const block = chunkHeaders[index];
            minHeight = Math.min(minHeight, block.height);
            if (block.height > height) continue;
            if (dbBlocks.hasOwnProperty(block.height) && dbBlocks[block.height] === block.id) {
                forkPoint = Math.min(...Object.keys(needProcessBlocks).map(item => Number(item)));
                return processResult(height, dbHeight, forkPoint, needProcessBlocks, network_type.label);
            }
            needProcessBlocks[block.height] = block.id;
        }
        paging.offset += paging.limit;
        paging.limit = Math.min(pageSize, paging.limit + 5);
    }
    return processResult(height, dbHeight, forkPoint, needProcessBlocks, network_type.label);
};

export {
    calcForkPoint
};
