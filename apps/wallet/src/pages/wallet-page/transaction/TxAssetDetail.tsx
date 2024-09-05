import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';
import { getValueColor } from '@/utils/functions';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

interface TxAssetDetailPropsType {
  id: string;
  amount: bigint;
  networkType: string;
}
const TxAssetDetail = (props: TxAssetDetailPropsType) => {
  const details = useAssetDetail(props.id, props.networkType);
  if (props.amount === 0n) return null;
  const color = getValueColor(props.amount);
  return (
    <React.Fragment>
      <Box sx={{ float: 'left', mr: 2 }}>
        {details.logo ? (
          <Avatar alt={details.name}>
            <details.logo />
          </Avatar>
        ) : (
          <Avatar alt={details.name} src="/" />
        )}
      </Box>
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{details.name}</Typography>
        <Typography color={color}>
          {props.amount > 0 ? '+' : ''}
          <TokenAmountDisplay amount={props.amount} decimal={details.decimal} />
        </Typography>
      </Box>
      <DisplayId
        variant="body2"
        color={color}
        id={props.amount > 0 ? 'Received' : 'Sent'}
      />
    </React.Fragment>
  );
};

export default TxAssetDetail;
