import {BlockDbAction} from "./db";
import { getNetworkType} from "../util/network_type";

export type Block = {
    id:string,
    height: number
}

/*
    insert array of block headers into databse.
    @param blocks : Block[]
    @param network_type : string
*/
export function insertToDB(blocks : Block[], network_type: string):void {
    blocks.forEach(block => {
        BlockDbAction.InsertHeaders(Object.entries(block).map(value => {
            return { id: block.id, height: block.height};
        }), network_type);   
    })
}

/*
    compare overlapBlock id with lastRecievedBlock id and update the overlap.
    @param overlapBlock : Block[]
    @param lastRecievedBlock : Block
    @return fork happend or not : Boolean
*/
export function checkFork(overlapBlock : Block, lastRecievedBlock : Block, newRecievedBlock: Block): Boolean {
    if(overlapBlock.id == lastRecievedBlock.id){
        overlapBlock = newRecievedBlock;
        return false;
    }
    else
        return true;
}

/*
    step forward and get all block headers after current height
    @param currentBlock : Block
    @param network_type: string
*/
export async function stepForward(currentBlock: Block, network_type: string):Promise<void>{
    const node = getNetworkType(network_type).getNode();
    const limit = 50;
    let fromHeight = currentBlock.height;
    let toHeight = fromHeight + limit;
   
    let reach_current : Boolean = false;
    let forkHappend : Boolean = false; //TODO: backward part

    let overlapBlock : Block = currentBlock;
    const lastBlockHeight : number = await node.getHeight();
      
    while(!reach_current){
        let recievedBlocks : Block[] = await node.getBlockHeaders(fromHeight, toHeight);
        insertToDB(recievedBlocks, network_type);
        forkHappend =  checkFork(overlapBlock, recievedBlocks[0], recievedBlocks[limit - 1]);
        if(recievedBlocks[limit - 1].height < lastBlockHeight) {
            fromHeight = toHeight - 1;
            toHeight = Math.min(lastBlockHeight + 1, fromHeight + limit);
        }
        else {
            reach_current = true;
        }

    }

};
