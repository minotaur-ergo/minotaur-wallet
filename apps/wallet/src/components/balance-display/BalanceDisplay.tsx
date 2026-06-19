import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  MAIN_NET_LABEL,
  TokenBalance,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
  networkType?: string | undefined;
  forceDisplay?: boolean;
  before?: string;
  after?: string;
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

  return !props.networkType || props.networkType === MAIN_NET_LABEL ? (
    <span onClick={switchDisplay}>
      {props.before}
      {symbol?.direction === 'l'
        ? `${symbol.symbol} ${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '}`
        : `${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '} ${symbol.symbol}`}
      {props.after}
    </span>
  ) : null;
};

export default BalanceDisplay;
