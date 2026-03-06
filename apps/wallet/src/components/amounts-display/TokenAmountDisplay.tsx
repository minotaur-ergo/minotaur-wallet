import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, TokenBalance } from '@minotaur-ergo/types';
import { commaSeparate, createEmptyArray } from '@minotaur-ergo/utils';
import { Box, Typography } from '@mui/material';

import BalanceDisplay from '../balance-display/BalanceDisplay';

interface TokenAmountDisplayPropsType {
  amount: bigint;
  decimal: number;
  displayDecimal?: number;
  tokenId?: string;
  showMonetaryValue?: boolean;
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
          (props.amount >= 0n
            ? props.amount.toString()
            : (-props.amount).toString())
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
      return props.displayDecimal === undefined
        ? decimalPart.replace(/0+$/, '')
        : decimalPart.substring(
            0,
            Math.min(props.displayDecimal, props.decimal),
          );
    }
    return '';
  }, [props.displayDecimal, props.decimal, decimalPart, showBalance]);
  const tokenBalances: TokenBalance[] = useMemo(() => {
    return props.tokenId
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
  }, [props.tokenId, props.amount]);
  const switchDisplay = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!showBalanceConfig) {
      setBalanceOverride(!balanceOverride);
    }
  };
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
        <React.Fragment>
          <span
            onClick={switchDisplay}
            style={{
              fontSize: showBalance ? 'inherit' : '60%',
            }}
          >
            {valuePart}
          </span>
          {decimalPartTrimmed.length > 0 ? (
            <React.Fragment>
              .
              <span onClick={switchDisplay} style={{ fontSize: '60%' }}>
                {decimalPartTrimmed}
              </span>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      </Typography>
      {(props.showMonetaryValue ?? false) && (
        <Typography
          component="span"
          sx={{ mt: 0.1, fontSize: 14, lineHeight: '16px', color: '#616161' }}
        >
          <BalanceDisplay
            amount={props.tokenId ? 0n : props.amount}
            tokenBalances={tokenBalances}
            forceDisplay={props.forceDisplay}
          />
        </Typography>
      )}
    </Box>
  );
};

export default TokenAmountDisplay;
