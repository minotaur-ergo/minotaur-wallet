export type Box = {
  boxId: string;
  value: bigint;
  ergoTree: string;
  assets: TokenAmount[];
  additionalRegisters: { [id: string]: string };
  creationHeight: number;
  transactionId: string;
  index: number;
};

export type BoxCandidate = {
  value: bigint;
  ergoTree: string;
  assets: TokenAmount[];
  additionalRegisters: { [id: string]: string };
  creationHeight: number;
};

type ContextExtension =
  | {
      /*  empty object for P2PK inputs */
    }
  | {
      values: { [id: string]: string };
    };

type DataInput = {
  boxId: string;
};

export type SignedInput = {
  boxId: string;
  spendingProof: ProverResult;
};

export type UnsignedInput = {
  extension: ContextExtension;
  boxId: string;
  value: bigint;
  ergoTree: string;
  assets: TokenAmount[];
  additionalRegisters: { [id: string]: string };
  creationHeight: number;
  transactionId: string;
  index: number;
};

export type Paginate = {
  page: number;
  limit: number;
};

type ProverResult = {
  proofBytes: string;
  extension: ContextExtension;
};

export type SignedTx = {
  id: string;
  inputs: SignedInput[];
  dataInputs: DataInput[];
  outputs: Box[];
  size: number;
};

type TokenAmount = {
  tokenId: string;
  amount: bigint;
};

export type Tx = {
  inputs: UnsignedInput[];
  dataInputs: DataInput[];
  outputs: BoxCandidate[];
};
