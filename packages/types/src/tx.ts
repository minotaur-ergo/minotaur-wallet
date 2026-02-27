interface TokenSpent {
  [tokenId: string]: bigint;
}
interface TotalSpent {
  value: bigint;
  tokens: TokenSpent;
}

interface TokenType {
  tokenId: string;
  amount: bigint;
}

enum BoxStatus {
  SPEND = 'spend',
  INVALID = 'invalid',
  AVAILABLE = 'available',
}

enum TxStatus {
  IN = 'in',
  OUT = 'out',
  NONE = 'none',
}

interface BoxSpendDetail {
  boxId: string;
  status: BoxStatus;
  spend?: {
    tx: string;
    height: number;
    timestamp: number;
    blockId: string;
    index: number;
  };
}

interface SpendDetail {
  tx: string;
  height: number;
  timestamp: number;
  index: number;
}

export { BoxStatus, TxStatus };

export type { TotalSpent, TokenSpent, TokenType, BoxSpendDetail, SpendDetail };
