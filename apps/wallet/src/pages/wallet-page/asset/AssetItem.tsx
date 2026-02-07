import { Card, CardActionArea } from '@mui/material';

import AssetRow from '@/components/asset-row/AssetRow';

interface PropsType {
  amount: bigint;
  id: string;
  network_type: string;
  handleClick: () => unknown;
}

const AssetItem = (props: PropsType) => {
  return (
    <Card>
      <CardActionArea onClick={() => props.handleClick()} sx={{ p: 2 }}>
        <AssetRow
          id={props.id}
          networkType={props.network_type}
          amount={props.amount}
        />
      </CardActionArea>
    </Card>
  );
};

export default AssetItem;
