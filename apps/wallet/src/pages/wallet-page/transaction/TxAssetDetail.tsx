import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
import { getValueColor } from '@minotaur-ergo/utils';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';
import AssetItemDetail from '@/pages/wallet-page/asset/AssetItemDetail';

interface TxAssetDetailPropsType {
  id: string;
  amount: bigint;
  networkType: string;
  issueAndBurn?: boolean;
}
const TxAssetDetail = (props: TxAssetDetailPropsType) => {
  const hideBalances = useSelector(
    (state: GlobalStateType) => state.config.hideBalances,
  );
  const details = useAssetDetail(props.id, props.networkType);
  const [showDetail, setShowDetail] = useState(false);
  if (props.amount === 0n) return null;
  const color = getValueColor(props.amount);
  const getLabel = () =>
    props.amount > 0
      ? props.issueAndBurn
        ? 'Issued'
        : 'Received'
      : props.issueAndBurn
        ? 'Burnt'
        : 'Sent';
  return (
    <React.Fragment>
      <ListItem
        disableGutters
        disablePadding
        onClick={() => setShowDetail(true)}
      >
        <ListItemAvatar>
          <Avatar alt={details.name} src={details.logoPath ?? '/'} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography component="span">{details.name}</Typography>
              <Typography component="span" color={color}>
                {hideBalances ? undefined : props.amount > 0 ? '+' : ''}
                <TokenAmountDisplay
                  amount={props.amount}
                  decimal={details.decimal}
                  hide={hideBalances}
                />
              </Typography>
            </React.Fragment>
          }
          primaryTypographyProps={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          secondary={
            <DisplayId
              id={props.id}
              endAdornment={
                <Typography color={color} ml={3}>
                  {getLabel()}
                </Typography>
              }
            />
          }
        />
      </ListItem>
      <Drawer
        anchor="bottom"
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <AssetItemDetail
          id={props.id}
          network_type={props.networkType}
          handleClose={() => setShowDetail(false)}
        />
      </Drawer>
    </React.Fragment>
  );
};

export default TxAssetDetail;
