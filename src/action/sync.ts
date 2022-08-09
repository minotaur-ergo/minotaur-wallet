type Block = {
    id:string,
    height:number
}
export async function stepForward():Promise<void>{
    const block: Block = {
        id: "",
        height: 0
    };
};