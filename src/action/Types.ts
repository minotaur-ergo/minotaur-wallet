import Address from "../db/entities/Address"

export type Block = {
    id : string,
    height : number
}
export type Box = {
    boxId: string,
    value: number,
    address: Address
}
export type Trx = {
    id: string,
    blockId: string,
    inclusionHeight: number,
    inputs: Box[],
    outputs: Box[]
}
export type HeightRange = {
    fromHeight : number,
    toHeight : number
}
