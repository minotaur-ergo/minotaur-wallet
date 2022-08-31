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
export const insertToDB = (blocks : Block[], network_type: string): void => {
    blocks.forEach(block => {
        BlockDbAction.InsertHeaders(Object.entries(block).map(value => {
            return { id: block.id, height: block.height};
        }), network_type);   
    })
};

/*
    compare overlapBlocks with 2 lastRecievedBlocks, update ther overlap and remove intersections from recievedBlocks.
    @param overlapBlock : Block[]
    @param lastRecievedBlock : Block
*/
export const checkOverlaps = (overlapBlocks : Block[], recievedBlocks: Block[]): void => {
    const sliceIndex = recievedBlocks.indexOf(overlapBlocks[1])
    if(sliceIndex === -1)
        throw new Error("overlaps not matched.")
    else {
        recievedBlocks.splice(sliceIndex + 1)
        overlapBlocks = recievedBlocks.slice(-2);
    }
}

/*
    create array of blocks by given IDs and computed heights.
    @param recievedIDs : string[]
    @param current_height : number
    @return Block[]
 */
export const createBlockArrayByID = (recievedIDs : string[], current_height : number) : Block[] => {
    current_height++;
    return recievedIDs.map( (id, index) => {
        return {
            id: id,
            height: current_height + index
        }
    })
}

/*
    set paging used in request headers.
    @param current_height : number 
    @param last_height : number
    @return constructed paging : Paging
*/
export const setPaging = (current_height : number , last_height : number, limit : number): Paging => {
    let current_offset = last_height - current_height;
    return {
        offset: Math.max(current_offset - limit + 2, 0),
        limit: limit
    }
}

/*
    step forward and get all block headers after current height
    @param currentBlock : Block
    @param network_type: string
*/
export const stepForward = async(currentBlock: Block, network_type: string):Promise<void> => {
    const node = getNetworkType(network_type).getNode();

    let paging : Paging
    let limit : number = INITIAL_LIMIT;
    
    let current_height : number = currentBlock.height;
    const last_height : number = await node.getHeight();
    
    let overlapBlocks : Block[] = [currentBlock]
    
    while((last_height - current_height) > 0){        
        paging = setPaging(current_height, last_height, limit);
        let recievedIDs : string[] = await node.getBlockHeaders(paging);
        limit = LIMIT;
        
        let recievedBlocks : Block[] = createBlockArrayByID(recievedIDs, current_height);      
        checkOverlaps(overlapBlocks, recievedBlocks)
        insertToDB(recievedBlocks, network_type);
        current_height += paging.limit;

    }

};
