import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, TokenBalance } from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
  forceDisplay?: boolean;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const {
    price: ergPrice,
    hideValues,
    symbol,
  } = useSelector((state: GlobalStateType) => state.config);

  const [balanceOverride, setBalanceOverride] = useState(false);

  const showBalance = useMemo(
    () => !hideValues || balanceOverride || props.forceDisplay,
    [hideValues, balanceOverride, props.forceDisplay],
  );
  const switchDisplay = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (hideValues) {
      setBalanceOverride(!balanceOverride);
    }
  };

  const totalTokensInErg = useTokensTotalInErg(props.tokenBalances);

  const value = ergPriceCurrency(props.amount + totalTokensInErg, ergPrice);

  return (
    <span onClick={switchDisplay}>
      {symbol?.direction === 'l'
        ? `${symbol.symbol} ${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '}`
        : `${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '} ${symbol.symbol}`}
    </span>
  );
};

export default BalanceDisplay;
