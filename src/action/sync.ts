import {BlockDbAction, TxDbAction, AddressDbAction} from "./db";
import { getNetworkType} from "../util/network_type";
import {Block, HeightRange, Trx} from './Types'
import { Paging } from "../util/network/paging";
import Address from "../db/entities/Address";
import { ErgoTx } from "../util/network/models";

//constants
const LIMIT = 50;
const INITIAL_LIMIT = 10;
const DB_HEIGHT_RANGE = 720;
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
    compare overlapBlocks with 2 lastRecievedBlocks, update their overlap and remove intersections from recievedBlocks.
    @param overlapBlock : Block[]
    @param lastRecievedBlock : Block
*/
export const checkOverlaps = (overlapBlocks : Block[], recievedBlocks: Block[]): void => {
    const sliceIndex = recievedBlocks.indexOf(overlapBlocks[1])
    if(sliceIndex === -1)
        throw new Error("overlaps not matched.")
    else {
        recievedBlocks.splice(sliceIndex + 1)
   
        const newOverlaps = recievedBlocks.slice(-2);
        overlapBlocks.map((block, index) => {
            block.id = newOverlaps[index].id;
            block.height = newOverlaps[index].height;
        })
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

/**
 * remove blocks with height > forkheight from db.
 * @param forkHeight : number
 * @param network_type : string
 */
export const removeFromDB = (forkHeight : number, network_type: string):void => {
    BlockDbAction.forkHeaders(forkHeight + 1 ,network_type);
}

/**
 * step backward and compare loaded blocks from db and recieved blocks from node, until reach fork point.
 * @param currentBlock 
 * @param network_type 
 * @returns forkPOint height : number
 */
export const calcFork = async(currentBlock: Block, network_type: string):Promise<number> => {
    const node = getNetworkType(network_type).getNode();
    let forkPoint: number = -1;
    let currHeight = currentBlock.height; 
  
    let loadedBlocks = await BlockDbAction.getAllHeaders(network_type);
    while(forkPoint == -1){
        let receivedID : string = await node.getBlockIdAtHeight(currHeight);
        forkPoint = receivedID ==  loadedBlocks[0].block_id ? currHeight : -1;
        loadedBlocks.shift();
        currHeight--;
    }
    return forkPoint;
}

/**
 * compare current block id with block id given from node api in same height.
 * @param currentBlock : Block
 * @param network_type : string
 * @returns fork happened or not : Promise<Boolean>
 */
export const checkFork = async(currentBlock: Block, network_type: string): Promise<Boolean> => {
    const node = getNetworkType(network_type).getNode();
    const receivedID:string = await node.getBlockIdAtHeight(currentBlock.height);
    return currentBlock.id != receivedID;
}

/**
 * if case of fork stepBackward to find fork point and remove all forked blocks from db; else step forward.
 * @param currentBlock : Block
 * @param network_type : network_type
 */
export const syncBlocks = async(currentBlock: Block, network_type: string):Promise<void> => {
    if(await checkFork(currentBlock, network_type)){
        let forkPoint = await calcFork(currentBlock, network_type);
        removeFromDB(forkPoint, network_type);
    }
    else
        stepForward(currentBlock, network_type);
}

/**
 * 
 */
export const insertTrxtoDB = (trxs : ErgoTx[], network_type:string): void => {
    //TODO
}

/**
 * 
 */
export const checkTrxValidation = async(trxs : ErgoTx[], network_type:string):Promise<void> => {
    let loadedHeaders = await BlockDbAction.getAllHeaders(network_type);
    let extractedHeaders = trxs.map(trx => {
        return {
            height: trx.inclusionHeight, 
            block_id: trx.blockId}
        });
    
    extractedHeaders.forEach(extracted => {
        const loaded = loadedHeaders.find(header => header.height == extracted.height);
        if(loaded == undefined)
            throw new Error('header not found.');
        else if(extracted.block_id != loaded.id.toString())
            throw new Error('blockIds not matched.');
    });
}   

/**
 * 
 */
export const syncTrxsWithAddress = async(address: Address, currentHeight: number, network_type: string) => {
    const explorer = getNetworkType(address.network_type).getExplorer();
    const node = getNetworkType(network_type).getNode();
    
    const lastHeight : number = await node.getHeight();
    let limit = 1;
    let heightRange :HeightRange = {
        fromHeight: currentHeight,
        toHeight: currentHeight
    };
  
    while(currentHeight < lastHeight){
        const Txs = await explorer.getTxsByAddressInHeightRange(address.address, heightRange, true);
        const filteredTxs = Txs.items.filter(tx => { tx.inclusionHeight >= lastHeight - DB_HEIGHT_RANGE});
        checkTrxValidation(filteredTxs ,network_type);
        insertTrxtoDB(Txs.items ,network_type);

        heightRange.fromHeight = heightRange.toHeight;
        heightRange.toHeight = Math.min(lastHeight, heightRange.toHeight + limit);
        limit += INITIAL_LIMIT;
    }
}

/**
 * 
 */
 export const syncTrxs = async(network_type: string, wallet_id: number) => {
    const allAddresses = await AddressDbAction.getWalletAddresses(wallet_id);
    allAddresses.forEach(address => {
        const currentHeight = address.process_height;
        syncTrxsWithAddress(address, currentHeight,network_type);
    });
}
