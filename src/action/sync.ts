import {BlockDbAction} from "./db";
import { getNetworkType} from "../util/network_type";
import {Block} from './Types'
import { Paging } from "../util/network/paging";
import { SemanticClassificationFormat } from "typescript";

//constants
const LIMIT = 50;
const INITIAL_LIMIT = 10;
//global variables
let isFirstStep = true;

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
    @return number of intersetions : number ( 0 or 1 or 2)
*/
export function checkFork(overlapBlocks : Block[], recievedBlocks: Block[]): number {
    let intersections : number = 0;
    if(overlapBlocks[0] == recievedBlocks[0]){
        intersections ++;
        recievedBlocks.shift();
    }
    if(overlapBlocks[1] == recievedBlocks[0]){
        intersections ++;
        recievedBlocks.shift();
    }
    overlapBlocks = recievedBlocks.slice(-2);
    return intersections;

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
export function setPaging(current_height : number , last_height : number): Paging {
    let isFirstStep : Boolean 
    return {
        offset: Math.min(current_height + LIMIT - 2, last_height),
        limit: setLimit()
    }
}

/*
    set paging's limit depending on which step the stepForward process is.
    @return limit : number
*/
export function setLimit() : number{
    let result = isFirstStep ? INITIAL_LIMIT : LIMIT;
    return result
}

/*
    step forward and get all block headers after current height
    @param currentBlock : Block
    @param network_type: string
*/
export async function stepForward(currentBlock: Block, network_type: string):Promise<void>{
    const node = getNetworkType(network_type).getNode();

    let paging : Paging
    let current_height : number = currentBlock.height;
    let reach_last_height : Boolean = false;
    
    let overlapBlocks : Block[] = [currentBlock]
    
    while(!reach_last_height){    
        const last_height : number = await node.getHeight();
        paging = setPaging(current_height, last_height);
        let recievedIDs : string[] = await node.getBlockHeaders(paging);
        
        let recievedBlocks : Block[] = createBlockArrayByID(recievedIDs, current_height);
        let intersectedBlocksNum : number = checkFork(overlapBlocks, recievedBlocks)
      
        if(intersectedBlocksNum == 0) //fork happened.
            return;
        insertToDB(recievedBlocks, network_type);
        isFirstStep = false;
        current_height = paging.offset;
        if(current_height == 0)
            reach_last_height = true;

    }

};
