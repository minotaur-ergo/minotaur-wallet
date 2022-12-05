export type PaginateError = {
  maxSize: number;
};

export type TxSignErrorCode = {
  ProofGeneration: 1;
  UserDeclined: 2;
};

export type TxSignError = {
  code: TxSignErrorCode;
  info: string;
};

export type DataSignErrorCode = {
  ProofGeneration: 1;
  AddressNotPK: 2;
  UserDeclined: 3;
  InvalidFormat: 4;
};

export type DataSignError = {
  code: DataSignErrorCode;
  info: string;
};
