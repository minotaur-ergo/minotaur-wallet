import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, TokenBalance } from '@minotaur-ergo/types';
import { commaSeparate, createEmptyArray } from '@minotaur-ergo/utils';
import { Box, Typography } from '@mui/material';

import BalanceDisplay from '../balance-display/BalanceDisplay';

interface TokenAmountDisplayPropsType {
  amount: bigint;
  decimal: number;
  displayDecimal?: number;
  isBalance?: boolean;
  tokenId?: string;
  showMonetaryValue?: boolean;
}

const TokenAmountDisplay = (props: TokenAmountDisplayPropsType) => {
  const { hideBalances, hideAssetsValues } = useSelector(
    (state: GlobalStateType) => state.config,
  );
  const amount_str =
    createEmptyArray(props.decimal, '0').join('') +
    (props.amount >= 0n ? props.amount.toString() : (-props.amount).toString());
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
  const isHidden: boolean = props.isBalance ? hideBalances : hideAssetsValues;
  const tokenBalances: TokenBalance[] = props.tokenId
    ? [
        {
          tokenId: props.tokenId,
          balance:
            props.amount >= 0n
              ? props.amount.toString()
              : (-props.amount).toString(),
        },
      ]
    : [];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: 'inherit',
          fontWeight: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
        }}
      >
        {isHidden ? (
          <Typography
            fontSize={12}
            component="span"
            style={{ display: 'inline-block', marginRight: 4 }}
          >
            ✻ ✻ ✻ ✻
          </Typography>
        ) : (
          <React.Fragment>
            <span>{valuePart}</span>
            {decimalPartTrimmed.length > 0 ? (
              <React.Fragment>
                .<span style={{ fontSize: '60%' }}>{decimalPartTrimmed}</span>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Typography>
      {(props.showMonetaryValue ?? false) && (
        <Typography
          component="span"
          sx={{ mt: 0.1, fontSize: 14, lineHeight: '16px', color: '#616161' }}
        >
          <BalanceDisplay
            amount={props.tokenId ? 0n : props.amount}
            tokenBalances={tokenBalances}
            showValue={!isHidden}
          />
        </Typography>
      )}
    </Box>
  );
};

export default TokenAmountDisplay;
