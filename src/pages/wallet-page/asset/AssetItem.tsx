import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Drawer,
  Typography,
} from '@mui/material';
import DisplayId from '@/components/display-id/DisplayId';
import AssetItemDetail from './AssetItemDetail';
import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import useAssetDetail from '@/hooks/useAssetDetail';

interface PropsType {
  amount: bigint;
  id: string;
  network_type: string;
}

const AssetItem = (props: PropsType) => {
  console.log(props)
  const [showDetail, setShowDetail] = useState(false);
  const details = useAssetDetail(props.id, props.network_type);
  return (
    <Card>
      <CardActionArea onClick={() => setShowDetail(true)} sx={{ p: 2 }}>
        <Box sx={{ float: 'left', mr: 2 }}>
          {details.logo ? (
            <Avatar alt={details.name}>
              <details.logo/>
            </Avatar>
          ) : (
            <Avatar alt={details.name} src='/' />
          )}
          
        </Box>
        <Box display="flex">
          <Typography sx={{ flexGrow: 1 }}>{details.name}</Typography>
          <Typography>
            <TokenAmountDisplay
              amount={props.amount}
              decimal={details.decimal}
            />
          </Typography>
        </Box>
        <DisplayId variant="body2" color="textSecondary" id={props.id} />
      </CardActionArea>

      <Drawer
        anchor="bottom"
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <AssetItemDetail
          id={props.id}
          name={details.name}
          logoSrc={details.logoSrc}
          balance={
            <TokenAmountDisplay
              amount={props.amount}
              decimal={details.decimal}
            />
          }
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
    </Card>
  );
};

export default AssetItem;
