import {BlockDbAction} from "./db";
import { getNetworkType} from "../util/network_type";
import {Block} from './Types'
import { Paging } from "../util/network/paging";

//constants
const LIMIT = 50;
const INITIAL_LIMIT = 10;

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
    compare overlapBlocks with 2 lastRecievedBlocks, update ther overlap and remove intersections from recievedBlocks.
    @param overlapBlock : Block[]
    @param lastRecievedBlock : Block
    @return forck happened or not : Boolean
*/
export function checkFork(overlapBlocks : Block[], recievedBlocks: Block[]): Boolean {
    const sliceIndex = recievedBlocks.indexOf(overlapBlocks[1])
    if(sliceIndex === -1)
        return true;
    else {
        recievedBlocks.slice(sliceIndex + 1)
        overlapBlocks = recievedBlocks.slice(-2);
        return false;
    }

}

/*
    create array of blocks by given IDs and computed heights.
    @param recievedIDs : string[]
    @param current_height : number
    @return Block[]
 */
export function createBlockArrayByID(recievedIDs : string[], current_height : number) : Block[]{
    let blockArr : Block[] = [];
    recievedIDs.forEach( id => {
        let block : Block = {
            id : id,
            height : ++current_height
        }
        blockArr.push(block)
    });
    return blockArr;
}

/*
    set paging used in request headers.
    @param current_height : number 
    @param last_height : number
    @return constructed paging : Paging
*/
export function setPaging(current_height : number , last_height : number, limit : number): Paging {
    return {
        offset: Math.min(current_height + limit - 2, last_height),
        limit: limit
    }
}

/*
    step forward and get all block headers after current height
    @param currentBlock : Block
    @param network_type: string
*/
export async function stepForward(currentBlock: Block, network_type: string):Promise<void>{
    const node = getNetworkType(network_type).getNode();

    let paging : Paging
    let limit : number = INITIAL_LIMIT;
    let current_height : number = currentBlock.height;
    
    let overlapBlocks : Block[] = [currentBlock]
    
    while(current_height > 0){    
        const last_height : number = await node.getHeight();
      
        paging = setPaging(current_height, last_height, limit);
        let recievedIDs : string[] = await node.getBlockHeaders(paging);
        limit = LIMIT;
        
        let recievedBlocks : Block[] = createBlockArrayByID(recievedIDs, current_height);      
        if(checkFork(overlapBlocks, recievedBlocks)) //fork happened.
            return;
        insertToDB(recievedBlocks, network_type);
        current_height = paging.offset;

    }

};
