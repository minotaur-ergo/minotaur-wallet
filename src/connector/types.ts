import * as CryptoJS from "crypto-js";

enum RegisterKeyType {
    R4 = "R4",
    R5 = "R5",
    R6 = "R6",
    R7 = "R7",
    R8 = "R8",
    R9 = "R9",
}

type TokenAmount = {
    tokenId: string,
    amount: string,
};

type BoxId = string;

type Value = string;

type ErgoTree = string;

type TxId = string;

type RegistersType = { [id in RegisterKeyType]: string }

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

type ContextExtension = {} | {
    values: { [id: string]: string }
};

type DataInput = {
    boxId: BoxId,
};

type ProverResult = {
    proofBytes: string;
    extension: ContextExtension;
};

type SignedInput = {
    boxId: BoxId;
    spendingProof: ProverResult;
};

type UnsignedInput = {
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

type Paginate = {
    page: number;
    limit: number;
};

type SignedTx = {
    id: TxId;
    inputs: SignedInput[];
    dataInputs: DataInput[];
    outputs: Box[];
    size: number;
};

type Tx = {
    inputs: UnsignedInput[];
    dataInputs: DataInput[];
    outputs: BoxCandidate[];
};

enum TxSendErrorCode {
    Refused = 1,
    Failure = 2,
}

export type TxSendError = {
    code: TxSendErrorCode;
    info: String;
}

export enum APIErrorCode {
    InvalidRequest = -1,
    InternalError = -2,
    Refused = -3,
}

export type APIError = {
    code: APIErrorCode,
    info: string;
}

export type PaginateError = {
    maxSize: number;
};

export type ActionType =
    "registered" |
    "confirm" |
    "boxes" |
    "balance" |
    "address" |
    "sign" |
    "submit";

export type ConfirmPayload = {
    id: string;
    display: string;
}

type ConfirmResponsePayload = {
    confirmed: boolean
}

type BoxRequestPayload = {
    amount: string;
    tokenId: string;
    page: Paginate;
}

type BoxResponsePayload = Array<Box> | undefined;

export type BalanceRequestPayload = {
    tokenIds: Array<string>;
}

type BalanceResponsePayload = { [tokenId: string]: string }

export type AddressRequestPayload = {
    type: "used" | "unused" | "change" | "all";
    page: Paginate
}

export type AddressResponsePayload = Array<string>


export type SingTxRequestPayload = {
    tx: Tx;
    index: "all" | number;
}

export type SignTxResponsePayload = SignedTx | SignedInput;

export type SignDataRequestPayload = {
    address: string;
    message: string
}

export type SignDataResponsePayload = string;

export type SubmitTxRequestPayload = {
    tx: SignedTx;
}

export type SubmitTxResponsePayload = TxId;

export type Payload = ConfirmPayload |
    ConfirmResponsePayload |
    BoxRequestPayload |
    BoxResponsePayload |
    BalanceRequestPayload |
    BalanceResponsePayload |
    AddressRequestPayload |
    AddressResponsePayload |
    SingTxRequestPayload |
    SignTxResponsePayload |
    SignDataRequestPayload |
    SignDataResponsePayload |
    SubmitTxRequestPayload |
    SubmitTxResponsePayload |
    APIError;


export type MessageContent = {
    action: ActionType;
    pageId: string;
    payloadType: string;
    requestId: string;
    payload: Payload;
}

export type MessageData = {
    sender: string;  // sender id. for server messages empty
    content: string; // Encrypted message
}

export interface PostMessage {
    action: "send" | "register",
    user?: string;
    content?: string;
    id?: string;
}

export const encrypt = (msg: MessageContent, password: string) => {
    return CryptoJS.AES.encrypt(JSON.stringify(msg), password).toString();
};

export const decrypt = (content: string, password: string) => {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as MessageContent;
};
