import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  TokenBalance,
  TokenValue,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';

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
  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );
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
  const totalTokensInErg = useMemo(() => {
    return props.tokenBalances
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
  }, [props.tokenBalances, tokenValues]);

  const value = useMemo(
    () => ergPriceCurrency(props.amount + (totalTokensInErg || 0n), ergPrice),
    [props.amount, totalTokensInErg, ergPrice],
  );

  return (
    <span onClick={switchDisplay}>
      {symbol?.direction === 'l'
        ? `${symbol.symbol} ${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '}`
        : `${showBalance ? value.toLocaleString() : ' ✻ ✻ ✻ ✻ '} ${symbol.symbol}`}
    </span>
  );
};

export default BalanceDisplay;
