enum BoxStatus {
  SPEND = 'spend',
  INVALID = 'invalid',
  AVAILABLE = 'available',
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

export type { BoxSpendDetail, SpendDetail };

export { BoxStatus };
