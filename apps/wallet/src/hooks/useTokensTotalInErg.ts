import { useSelector } from 'react-redux';

import { GlobalStateType, TokenValue } from '@minotaur-ergo/types';

export interface TokenInput {
  tokenId: string;
  balance: bigint | number | string;
}

export const useTokensTotalInErg = (tokens: TokenInput[]): bigint => {
  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );

  if (!tokens || tokens.length === 0) return 0n;

  return tokens
    .map((t) => {
      const tv: TokenValue = tokenValues.get(t.tokenId) || {
        valueInErg: 0,
        decimal: 0,
      };

      return BigInt(
        Math.round(tv.valueInErg * 10 ** 9) *
          Math.round(Number(t.balance) / 10 ** tv.decimal),
      );
    })
    .reduce((a, b) => a + b, 0n);
};
