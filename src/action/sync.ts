type Block = {
    id:string,
    height:number
}
export function insertToDB(block : Block):void {
    
}

export async function stepForward():Promise<void>{
    const block: Block = {
        id: '3',
        height: 0
    };
};
