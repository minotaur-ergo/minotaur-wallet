import { useSelector } from 'react-redux';

import { GlobalStateType, SymbolType } from '@minotaur-ergo/types';
import { ergPriceCurrency } from '@minotaur-ergo/utils';
import { Typography, TypographyProps } from '@mui/material';

interface BalanceDisplayPropsType extends TypographyProps {
  amount: bigint;
}

const BalanceDisplay = ({
  amount,
  ...typographyProps
}: BalanceDisplayPropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const value = ergPriceCurrency(amount, ergPrice);
  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );
  return (
    <Typography {...typographyProps}>
      {symbol?.direction === 'l'
        ? `${symbol.symbol} ${value.toLocaleString()}`
        : `${value.toLocaleString()} ${symbol.symbol}`}
    </Typography>
  );
};

export default BalanceDisplay;
