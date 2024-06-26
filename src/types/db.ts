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

interface BoxSpendInfo {
  box_id: string;
  spend_tx_id: string;
  spend_index: number;
  spend_height: number;
  spend_timestamp: number;
}

interface TxInfo {
  height: number;
  timestamp: number;
}

interface ItemBoxInfos {
  items: Array<BoxInfo>;
  total: number;
}

export type { ItemBoxInfos, TokenInfo, BoxInfo, TxInfo, BoxSpendInfo };
