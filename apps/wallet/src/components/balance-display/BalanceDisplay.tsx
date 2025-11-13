import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  SymbolType,
  TokenBalance,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );
  const totalTokensInErg = props.tokenBalances
    .map((t) => {
      for (const tv of tokenValues) {
        if (tv.id === t.tokenId) {
          return BigInt(
            Math.round(tv.valueInNanoErg * 10 ** 9) *
              Math.round(Number(t.balance) / 10 ** tv.decimal),
          );
        }
      }
      return 0n;
    })
    .reduce((a, b) => a + b, 0n);
  const value = ergPriceCurrency(
    props.amount + (totalTokensInErg || 0n),
    ergPrice,
  );
  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );
  return symbol?.direction === 'l'
    ? `${symbol.symbol} ${value.toLocaleString()}`
    : `${value.toLocaleString()} ${symbol.symbol}`;
};

export default BalanceDisplay;
