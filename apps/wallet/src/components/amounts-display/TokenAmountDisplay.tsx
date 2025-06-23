import React from 'react';

import { commaSeparate } from '@/utils/convert';
import { createEmptyArray } from '@/utils/functions';

interface TokenAmountDisplayPropsType {
  amount: bigint;
  decimal: number;
  displayDecimal?: number;
}

const TokenAmountDisplay = (props: TokenAmountDisplayPropsType) => {
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
  return (
    <React.Fragment>
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
