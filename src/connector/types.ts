export type BoxId = string;

export type Value = number | string;

export type ErgoTree = string;

export type TxId = string;

export type Constant = string;

export type TokenId = string;

export type RegisterKey = 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';

export type RegistersType = Record<RegisterKey, Constant>;

export type TokenAmount = {
  tokenId: TokenId;
  amount: Value;
};

export type Box = {
  boxId: BoxId;
  value: Value;
  ergoTree: ErgoTree;
  assets: Array<TokenAmount>;
  additionalRegisters: RegistersType;
  creationHeight: number;
  transactionId: TxId;
  index: number;
};

export type BoxCandidate = {
  value: Value;
  ergoTree: ErgoTree;
  assets: Array<TokenAmount>;
  additionalRegisters: RegistersType;
  creationHeight: number;
};

export type ContextExtension = {
  values?: { [key: string]: string };
};

export type DataInput = {
  boxId: BoxId;
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
  assets: Array<TokenAmount>;
  additionalRegisters: RegistersType;
  creationHeight: number;
  transactionId: TxId;
  index: number;
};

export type Paginate = {
  page: number;
  limit: number;
};

export type ProverResult = {
  proofBytes: string;
  extension: ContextExtension;
};

export type SignedTx = {
  id: TxId;
  inputs: Array<SignedInput>;
  dataInputs: Array<DataInput>;
  outputs: Array<Box>;
  size: number;
};

export type Tx = {
  inputs: Array<UnsignedInput>;
  dataInputs: Array<DataInput>;
  outputs: Array<BoxCandidate>;
};

export enum TxSendErrorCode {
  Refused = 1,
  Failure = 2,
}

export type TxSendError = {
  code: TxSendErrorCode;
  info: string;
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

export enum APIErrorCode {
  InvalidRequest = -1,
  InternalError = -2,
  Refused = -3,
}
export type APIError = {
  code: APIErrorCode;
  info: string;
};

export type PaginateError = {
  maxSize: number;
};
