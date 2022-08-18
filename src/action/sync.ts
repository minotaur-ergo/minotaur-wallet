import {BlockDbAction} from "./db";
import { NetworkType, getNetworkType} from "../util/network_type";
import { Paging } from "../util/network/paging";

type Block = {
    id:string,
    height:number
}
const network_type: NetworkType = getNetworkType("Testnet")

export function insertToDB(block : Block):void {
    BlockDbAction.InsertHeaders(Object.entries(block).map(value => {
        return { id: block.id, height: block.height };
    }), "Testnet");   
}

export async function stepForward():Promise<void>{
    let paging: Paging = { offset: 0, limit: 1 };
    const recieveditem = (await network_type.getExplorer().getBlocksHeaders(paging)).items;
    const recievedBlock: Block = {
        id: recieveditem[0].id,
        height: recieveditem[0].height
    }
    insertToDB(recievedBlock)
};
