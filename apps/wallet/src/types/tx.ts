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

export type { TotalSpent, TokenSpent, TokenType };
