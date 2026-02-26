import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
import { commaSeparate, createEmptyArray } from '@minotaur-ergo/utils';
import { Typography } from '@mui/material';

interface TokenAmountDisplayPropsType {
  amount: bigint;
  decimal: number;
  displayDecimal?: number;
  isBalance?: boolean;
  sign?: string;
}

const TokenAmountDisplay = (props: TokenAmountDisplayPropsType) => {
  const { hideBalances, hideAssetsValues } = useSelector(
    (state: GlobalStateType) => state.config,
  );
  const amount_str =
    createEmptyArray(props.decimal, '0').join('') + props.amount.toString();
  const valuePart = commaSeparate(
    amount_str
      .substring(0, amount_str.length - props.decimal)
      .replace(/^0+/, '') || '0',
  );
  const decimalPart = amount_str.substring(amount_str.length - props.decimal);
  const decimalPartTrimmed =
    props.displayDecimal === undefined
      ? decimalPart.replace(/0+$/, '')
      : decimalPart.substring(0, Math.min(props.displayDecimal, props.decimal));
  return (props.isBalance ? hideBalances : hideAssetsValues) ? (
    <Typography component="span" style={{ display: 'inline-block' }}>
      *****
    </Typography>
  ) : (
    <React.Fragment>
      {props.sign}
      <span>{valuePart}</span>
      {decimalPartTrimmed.length > 0 ? (
        <React.Fragment>
          .<span style={{ fontSize: '60%' }}>{decimalPartTrimmed}</span>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default TokenAmountDisplay;
