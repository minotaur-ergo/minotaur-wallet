
export enum RegisterKeyType {
    R4 = "R4",
    R5 = "R5",
    R6 = "R6",
    R7 = "R7",
    R8 = "R8",
    R9 = "R9",
}

export type TokenAmount = {
    tokenId: string,
    amount: string,
};

type BoxId = string;

type Value = string;

type ErgoTree = string;

export type TxId = string;

export type RegistersType = { [id in RegisterKeyType]: string }

export type Box = {
    boxId: BoxId;
    value: Value;
    ergoTree: ErgoTree;
    assets: TokenAmount;
    additionalRegisters: RegistersType
    creationHeight: number;
    transactionId: TxId;
    index: number;
}

export type BoxCandidate = {
    value: Value;
    ergoTree: ErgoTree;
    assets: Array<TokenAmount>;
    additionalRegisters: RegistersType;
    creationHeight: number;
};

export type ContextExtension = {} | {
    values: { [id: string]: string }
};

export type DataInput = {
    boxId: BoxId,
};

export type ProverResult = {
    proofBytes: string;
    extension: ContextExtension;
};

export type SignedInput = {
    boxId: BoxId;
    spendingProof: ProverResult;
};

export type UnsignedInput = {
    extension: ContextExtension;
    boxId: BoxId;
    value: Value;
    ergoTree: ErgoTree;
    assets: TokenAmount[];
    additionalRegisters: RegistersType;
    creationHeight: number;
    transactionId: TxId;
    index: number;
};

export type SignedTx = {
    id: TxId;
    inputs: SignedInput[];
    dataInputs: DataInput[];
    outputs: Box[];
    size: number;
};

export type Tx = {
    inputs: UnsignedInput[];
    dataInputs: DataInput[];
    outputs: BoxCandidate[];
};
