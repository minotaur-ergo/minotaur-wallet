import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  SymbolType,
  TokenBalance,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const { price: ergPrice, hideBalances } = useSelector(
    (state: GlobalStateType) => state.config,
  );

  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );

  const totalTokensInErg = useTokensTotalInErg(props.tokenBalances);

  const value = ergPriceCurrency(props.amount + totalTokensInErg, ergPrice);

  const displayValue = () => {
    return symbol?.direction === 'l'
      ? `${symbol.symbol} ${hideBalances ? ' ✻ ✻ ✻ ✻ ' : value.toLocaleString()}`
      : `${hideBalances ? ' ✻ ✻ ✻ ✻ ' : value.toLocaleString()} ${symbol.symbol}`;
  };

  return displayValue();
};

export default BalanceDisplay;
