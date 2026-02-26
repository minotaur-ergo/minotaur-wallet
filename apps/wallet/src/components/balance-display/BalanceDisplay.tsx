import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  SymbolType,
  TokenBalance,
  TokenValue,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const { price: ergPrice, hideBalances } = useSelector(
    (state: GlobalStateType) => state.config,
  );

  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );

  const totalTokensInErg = props.tokenBalances
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

  const value = ergPriceCurrency(
    props.amount + (totalTokensInErg || 0n),
    ergPrice,
  );

  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );

  const displayValue = () => {
    return symbol?.direction === 'l'
      ? `${symbol.symbol} ${hideBalances ? ' ✻ ✻ ✻ ✻ ' : value.toLocaleString()}`
      : `${hideBalances ? ' ✻ ✻ ✻ ✻ ' : value.toLocaleString()} ${symbol.symbol}`;
  };

  return displayValue();
};

export default BalanceDisplay;
