export enum DataSignErrorCode {
    ProofGeneration = 1,
    AddressNotPK = 2,
    UserDeclined = 3,
    InvalidFormat = 4,
}

export enum TxSignErrorCode {
    ProofGeneration = 1,
    UserDeclined = 2,
}

export enum APIErrorCode {
    InvalidRequest = -1,
    InternalError = -2,
    Refused = -3,
}

export enum TxSendErrorCode {
    Refused = 1,
    Failure = 2,
}

export type TxSendError = {
    code: TxSendErrorCode;
    info: String;
}

export type TxSignError = {
    code: TxSignErrorCode;
    info: String;
}

export type APIError = {
    code: APIErrorCode,
    info: string;
}

export type PaginateError = {
    maxSize: number;
};
