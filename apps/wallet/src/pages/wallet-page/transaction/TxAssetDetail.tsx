import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';
import AssetItemDetail from '@/pages/wallet-page/asset/AssetItemDetail';
import { getValueColor } from '@/utils/functions';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState } from 'react';

interface TxAssetDetailPropsType {
  id: string;
  amount: bigint;
  networkType: string;
  issueAndBurn?: boolean;
}
const TxAssetDetail = (props: TxAssetDetailPropsType) => {
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
                {props.amount > 0 ? '+' : ''}
                <TokenAmountDisplay
                  amount={props.amount}
                  decimal={details.decimal}
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
          logo={details.logo}
          name={details.name}
          description={details.description}
          emissionAmount={
            details.emissionAmount > 0n ? (
              <TokenAmountDisplay
                amount={details.emissionAmount}
                decimal={details.decimal}
              />
            ) : (
              '?'
            )
          }
          txId={details.txId}
          handleClose={() => setShowDetail(false)}
        />
      </Drawer>
    </React.Fragment>
  );
};

export default TxAssetDetail;
