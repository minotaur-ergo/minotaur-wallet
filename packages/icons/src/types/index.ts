export interface Token {
  id: string;
  icon: React.ElementType;
  iconB64: string;
  decimals: number;
  name: string;
  description: string;
  networkType: string;
  emissionAmount: bigint;
  height: number;
  txId: string;
  boxId: string;
}
