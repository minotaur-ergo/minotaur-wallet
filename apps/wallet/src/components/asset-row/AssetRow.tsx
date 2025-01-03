import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';
import { Avatar, Box, Typography } from '@mui/material';

interface AssetRowPropsType {
  id: string;
  networkType: string;
  amount?: bigint | string;
  width?: string;
}

const AssetRow = (props: AssetRowPropsType) => {
  const details = useAssetDetail(props.id, props.networkType);
  return (
    <div style={{ width: props.width }}>
      <Box sx={{ float: 'left', mr: 2 }}>
        <Avatar alt={details.name} src={details.logoPath ?? '/'} />
      </Box>
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{details.name}</Typography>
        {props.amount ? (
          <Typography>
            <TokenAmountDisplay
              amount={BigInt(props.amount)}
              decimal={details.decimal}
            />
          </Typography>
        ) : undefined}
      </Box>
      <DisplayId variant="body2" color="textSecondary" id={props.id} />
    </div>
  );
};

export default AssetRow;
