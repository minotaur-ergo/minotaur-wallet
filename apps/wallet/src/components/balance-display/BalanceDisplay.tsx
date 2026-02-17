import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  SymbolType,
  TokenBalance,
  TokenValue,
} from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface BalanceDisplayPropsType {
  amount: bigint;
  tokenBalances: Array<TokenBalance>;
  showBalances: boolean;
  setShowBalances?: (show: boolean) => void;
  iconColor?: string;
}

const BalanceDisplay = (props: BalanceDisplayPropsType) => {
  const iconStyle = {
    color: props.iconColor || '#fff',
    fontSize: 20,
  };

  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);

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
    if (!props.showBalances) {
      return '*****';
    }
    return symbol?.direction === 'l'
      ? `${symbol.symbol} ${value.toLocaleString()}`
      : `${value.toLocaleString()} ${symbol.symbol}`;
  };

  const toggleShowBalances = () => {
    if (props.setShowBalances) {
      props.setShowBalances(!props.showBalances);
    }
  };

  return (
    <>
      {displayValue()}
      {props.setShowBalances && (
        <IconButton
          onClick={toggleShowBalances}
          size="large"
          style={{ marginBottom: props.showBalances ? 4 : 10 }}
        >
          {props.showBalances ? (
            <VisibilityOff style={iconStyle} />
          ) : (
            <Visibility style={iconStyle} />
          )}
        </IconButton>
      )}
    </>
  );
};

export default BalanceDisplay;
