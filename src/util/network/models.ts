export type ProverResult = {
  readonly proof: Uint8Array;
  readonly extension: { [key: string]: string };
};

export type SigmaType = 'SInt' | 'SLong' | 'Coll[Byte]';

export type Input = {
  readonly boxId: string;
  readonly spendingProof: ProverResult;
};

export type BoxAsset = {
  tokenId: string;
  index: number;
  amount: bigint;
  name?: string;
  decimals?: number;
};

export type BoxRegister = {
  serializedValue: string;
  sigmaType: SigmaType;
  renderedValue: string;
};

export type ErgoBox = {
  boxId: string;
  transactionId: string;
  blockId: string;
  value: bigint;
  index: number;
  creationHeight: number;
  settlementHeight: number;
  ergoTree: string;
  address: string;
  assets: BoxAsset[];
  additionalRegisters: { [key: string]: BoxRegister };
  spentTransactionId?: string;
};

export type DataInput = {
  readonly boxId: string;
};

export type InputBox = Input & ErgoBox;

export type ErgoTx = {
  readonly id: string;
  readonly blockId: string;
  readonly inclusionHeight: number;
  readonly inputs: InputBox[];
  readonly dataInputs: DataInput[];
  readonly outputs: ErgoBox[];
  readonly size: number;
  readonly timestamp: number;
};

export type Items<T> = {
  items: T[];
  total: number;
};

export type NetworkContext = {
  readonly lastBlockId: string;
  readonly height: number;
  readonly lastBlocks: Array<BlockHeader>;
};

export type PowSolution = {
  readonly pk: string;
  readonly w: string;
  readonly n: string;
  readonly d: bigint;
};

export type BlockHeader = {
  readonly extensionId: string;
  readonly difficulty: bigint;
  readonly votes: string;
  readonly timestamp: number;
  readonly size: number;
  readonly stateRoot: string;
  readonly height: number;
  readonly nBits: string;
  readonly version: number;
  readonly id: string;
  readonly adProofsRoot: string;
  readonly transactionsRoot: string;
  readonly extensionHash: string;
  readonly powSolutions: PowSolution;
  readonly adProofsId: string;
  readonly transactionsId: string;
  readonly parentId: string;
};

export type HeadersBlockExplorer = {
  readonly id: string;
  readonly height: number;
};

export type NodeInfo = {
  readonly fullHeight: number;
  readonly headersHeight: number;
};

export type TokenInfo = {
  readonly id: string;
  readonly boxId: string;
  readonly emissionAmount: number;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly decimals: number;
};

export type Token = {
  tokenId: string;
  amount: bigint;
  decimals: number;
  name: string;
  tokenType: string;
};

export type AddressInfo = {
  readonly nanoErgs: bigint;
  readonly tokens: Array<Token>;
};
