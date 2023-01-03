export type PaginateError = {
  maxSize: number;
};

export enum TxSignErrorCode {
  ProofGeneration = 1,
  UserDeclined = 2,
}

export type TxSignError = {
  code: TxSignErrorCode;
  info: string;
};

export enum DataSignErrorCode {
  ProofGeneration = 1,
  AddressNotPK = 2,
  UserDeclined = 3,
  InvalidFormat = 4,
}

export type DataSignError = {
  code: DataSignErrorCode;
  info: string;
};

export enum TxSendErrorCode {
  Refused = 1,
  Failure = 2,
}

export type TxSendError = {
  code: TxSendErrorCode;
  info: string;
};

export enum APIErrorCode {
  InvalidRequest = -1,
  InternalError = -2,
  Refused = -3,
}

export type APIError = {
  code: APIErrorCode;
  info: string;
};

export const NotImplementedError: APIError = {
  code: APIErrorCode.InvalidRequest,
  info: 'Not implemented.',
};
