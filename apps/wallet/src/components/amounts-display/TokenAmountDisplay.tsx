import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
import { commaSeparate, createEmptyArray } from '@minotaur-ergo/utils';

interface TokenAmountDisplayPropsType {
  amount: bigint;
  decimal: number;
  displayDecimal?: number;
  sign?: string;
  forceDisplay?: boolean;
}

const TokenAmountDisplay = (props: TokenAmountDisplayPropsType) => {
  const [balanceOverride, setBalanceOverride] = useState(false);
  const showBalanceConfig = useSelector(
    (state: GlobalStateType) => !state.config.hideValues,
  );
  const showBalance = useMemo(
    () => showBalanceConfig || balanceOverride || props.forceDisplay,
    [showBalanceConfig, balanceOverride, props.forceDisplay],
  );
  const amountStr = useMemo(
    () =>
      showBalance
        ? createEmptyArray(props.decimal, '0').join('') +
          props.amount.toString()
        : '',
    [props.amount, props.decimal, showBalance],
  );
  const valuePart = useMemo(() => {
    if (showBalance) {
      return commaSeparate(
        amountStr
          .substring(0, amountStr.length - props.decimal)
          .replace(/^0+/, '') || '0',
      );
    } else {
      return '✻ ✻ ✻ ✻';
    }
  }, [amountStr, showBalance, props.decimal]);
  const decimalPart = useMemo(
    () => amountStr.substring(amountStr.length - props.decimal),
    [props.decimal, amountStr],
  );
  const decimalPartTrimmed = useMemo(() => {
    if (showBalance) {
      props.displayDecimal === undefined
        ? decimalPart.replace(/0+$/, '')
        : decimalPart.substring(
            0,
            Math.min(props.displayDecimal, props.decimal),
          );
    }
    return '';
  }, [props.displayDecimal, props.decimal, decimalPart, showBalance]);
  const sign = useMemo(
    () => (showBalance ? props.sign : ''),
    [showBalance, props.sign],
  );
  const switchDisplay = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!showBalanceConfig) {
      setBalanceOverride(!balanceOverride);
    }
  };
  return (
    <React.Fragment>
      {sign}
      <span onClick={switchDisplay}>{valuePart}</span>
      {decimalPartTrimmed.length > 0 ? (
        <React.Fragment>
          .
          <span onClick={switchDisplay} style={{ fontSize: '60%' }}>
            {decimalPartTrimmed}
          </span>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default TokenAmountDisplay;
