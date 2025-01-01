import AssetRow from '@/components/asset-row/AssetRow';
import { useState } from 'react';
import { Card, CardActionArea, Drawer } from '@mui/material';
import AssetItemDetail from './AssetItemDetail';
import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import useAssetDetail from '@/hooks/useAssetDetail';

interface PropsType {
  amount: bigint;
  id: string;
  network_type: string;
}

const AssetItem = (props: PropsType) => {
  const [showDetail, setShowDetail] = useState(false);
  const details = useAssetDetail(props.id, props.network_type);
  return (
    <Card>
      <CardActionArea onClick={() => setShowDetail(true)} sx={{ p: 2 }}>
        <AssetRow
          id={props.id}
          network_type={props.network_type}
          amount={props.amount}
        />
      </CardActionArea>
      <Drawer
        anchor="bottom"
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <AssetItemDetail
          id={props.id}
          logo={details.logo}
          name={details.name}
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
