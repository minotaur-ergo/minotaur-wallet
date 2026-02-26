import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalStateType,
  SymbolType,
  TokenBalance,
  TokenValue,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { setHideBalances } from '@/store/reducer/config';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
  showToggle?: boolean;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const dispatch = useDispatch();
  const { price: ergPrice, hideBalances } = useSelector(
    (state: GlobalStateType) => state.config,
  );

  const iconSx = {
    color: 'text.secondary',
    fontSize: 20,
  };

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
    if (hideBalances) {
      return '*****';
    }
    return symbol?.direction === 'l'
      ? `${symbol.symbol} ${value.toLocaleString()}`
      : `${value.toLocaleString()} ${symbol.symbol}`;
  };

  const toggleShowBalances = () => {
    dispatch(setHideBalances(!hideBalances));
  };

  return (
    <>
      {displayValue()}
      {props.showToggle && (
        <IconButton
          onClick={toggleShowBalances}
          size="large"
          style={{ marginBottom: hideBalances ? 10 : 4 }}
        >
          {hideBalances ? (
            <Visibility style={iconSx} />
          ) : (
            <VisibilityOff style={iconSx} />
          )}
        </IconButton>
      )}
    </>
  );
};

export default BalanceDisplay;
