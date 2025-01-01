import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';
import AssetItemDetail from '@/pages/wallet-page/asset/AssetItemDetail';
import { getValueColor } from '@/utils/functions';
import { Avatar, Box, Typography } from '@mui/material';
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
      <Box sx={{ float: 'left', mr: 2 }}>
        <Avatar alt={details.name} src={details.logoPath ?? '/'} />
      </Box>
      <Box display="flex" onClick={() => setShowDetail(true)}>
        <Typography sx={{ flexGrow: 1 }}>{details.name}</Typography>
        <Typography color={color}>
          {props.amount > 0 ? '+' : ''}
          <TokenAmountDisplay amount={props.amount} decimal={details.decimal} />
        </Typography>
      </Box>
      <DisplayId variant="body2" color={color} id={getLabel()} />
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
