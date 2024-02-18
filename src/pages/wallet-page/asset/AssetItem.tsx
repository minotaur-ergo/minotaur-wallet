import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Drawer,
  Typography,
} from '@mui/material';
import { AssetDbAction } from '@/action/db';
import DisplayId from '@/components/display-id/DisplayId';
import AssetItemDetail from './AssetItemDetail';
import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';

interface PropsType {
  amount: bigint;
  id: string;
  network_type: string;
}

const AssetItem = (props: PropsType) => {
  const [showDetail, setShowDetail] = useState(false);
  const [loadedToken, setLoadedToken] = useState('');
  const [details, setDetails] = useState<{
    name: string;
    logoSrc: string;
    description: string;
    decimal: number;
    emissionAmount: bigint;
    txId: string;
  }>({
    name: '',
    decimal: 0,
    description: '',
    logoSrc: '/',
    txId: '',
    emissionAmount: -1n,
  });
  useEffect(() => {
    if (props.id !== loadedToken) {
      const loadId = props.id;
      AssetDbAction.getInstance()
        .getAssetByAssetId(loadId, props.network_type)
        .then((asset) => {
          if (asset) {
            const decimal = asset.decimal ? asset.decimal : 0;
            setDetails({
              name: asset.name ? asset.name : props.id.substring(0, 6),
              description: asset.description ? asset.description : '',
              decimal,
              logoSrc: '/',
              emissionAmount: asset.emission_amount
                ? BigInt(asset.emission_amount)
                : 0n,
              txId: asset.tx_id ? asset.tx_id : '',
            });
          } else {
            setDetails({
              name: props.id.substring(0, 6),
              description: '',
              decimal: 0,
              logoSrc: '/',
              emissionAmount: -1n,
              txId: '',
            });
          }
          setLoadedToken(loadId);
        });
    }
  });
  return (
    <Card>
      <CardActionArea onClick={() => setShowDetail(true)} sx={{ p: 2 }}>
        <Box sx={{ float: 'left', mr: 2 }}>
          <Avatar alt={details.name} src={details.logoSrc || '/'} />
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
