import { useSelector } from 'react-redux';

import { GlobalStateType, SymbolType } from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

interface BalanceDisplayPropsType {
  amount: bigint;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const value = ergPriceCurrency(props.amount, ergPrice);
  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );
  return symbol?.direction === 'l'
    ? `${symbol.symbol} ${value.toLocaleString()}`
    : `${value.toLocaleString()} ${symbol.symbol}`;
};

export default BalanceDisplay;
