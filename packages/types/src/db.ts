enum WalletType {
  ReadOnly = 'READ_ONLY',
  Normal = 'NORMAL',
  MultiSig = 'MULTI_SIG',
}

interface TokenInfo {
  id: string;
  boxId?: string;
  name?: string;
  description?: string;
  height: number;
  decimals?: number;
  emissionAmount?: bigint;
  txId?: string;
}

interface BoxCreateInfo {
  index: number;
  height: number;
  tx: string;
  timestamp: number;
}

interface BoxInfo {
  address: string;
  boxId: string;
  create: BoxCreateInfo;
  spend?: BoxCreateInfo;
  serialized: string;
}

interface TxInfo {
  height: number;
  timestamp: number;
}

interface ItemBoxInfos {
  items: Array<BoxInfo>;
  total: number;
}

export type { ItemBoxInfos, TokenInfo, BoxInfo, TxInfo };
export { WalletType };
