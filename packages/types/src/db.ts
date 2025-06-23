export enum WalletType {
  ReadOnly = 'READ_ONLY',
  Normal = 'NORMAL',
  MultiSig = 'MULTI_SIG',
}

export interface TokenInfo {
  id: string;
  boxId?: string;
  name?: string;
  description?: string;
  height: number;
  decimals?: number;
  emissionAmount?: bigint;
  txId?: string;
}

export interface BoxCreateInfo {
  index: number;
  height: number;
  tx: string;
  timestamp: number;
}

export interface BoxInfo {
  address: string;
  boxId: string;
  create: BoxCreateInfo;
  spend?: BoxCreateInfo;
  serialized: string;
}

export interface TxInfo {
  height: number;
  timestamp: number;
}

export interface ItemBoxInfos {
  items: Array<BoxInfo>;
  total: number;
}

export interface WalletTransactionType {
  txId: string;
  date: Date;
  ergIn: bigint;
  ergOut: bigint;
  tokens: Map<string, bigint>;
}
