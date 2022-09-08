export type Block = {
    id : string,
    height : number
}
export type Box = {
    boxId: string,
    value: number,
    address: string
}
export type Trx = {
    id: string,
    blockId: string,
    inclusionHeight: number,
    inputs: Box[],
    outputs: Box[]
}