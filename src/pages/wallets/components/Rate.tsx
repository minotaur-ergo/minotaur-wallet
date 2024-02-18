import { GlobalStateType } from '@/store';
import { Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

interface RatePropsType {
  totalErg: bigint;
  totalErgLastWeek: bigint;
}

const Rate = (props: RatePropsType) => {
  const ergPriceLastWeek = useSelector(
    (state: GlobalStateType) => state.config.priceLastWeek,
  );
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const ergDiffAvailable = props.totalErg + props.totalErgLastWeek > 0n;
  const ergFactorBigInt = ergDiffAvailable
    ? (props.totalErg * 10000n) / props.totalErgLastWeek
    : 10000n;
  const ergFactor = parseInt(ergFactorBigInt.toString()) / 10000;
  const priceFactor = ergPrice / ergPriceLastWeek;
  const rate = ergFactor * (isNaN(priceFactor) ? 1 : priceFactor) * 100 - 100;
  return (
    <React.Fragment>
      {ergDiffAvailable ? '' : 'ERG Price '}
      <Typography
        color={rate > 0 ? 'success.light' : rate === 0 ? '' : 'error.light'}
        variant="body2"
        component="span"
      >
        {rate > 0 ? '+' : ''}
        {rate.toFixed(2)}%{' '}
      </Typography>
      from last week
    </React.Fragment>
  );
};

export default Rate;
