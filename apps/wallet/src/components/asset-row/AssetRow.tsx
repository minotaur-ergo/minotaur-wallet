import { Avatar, Box, Typography } from '@mui/material';

import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import DisplayId from '@/components/display-id/DisplayId';
import useAssetDetail from '@/hooks/useAssetDetail';

interface AssetRowPropsType {
  id: string;
  networkType: string;
  amount?: bigint | string;
  width?: string;
}

const AssetRow = (props: AssetRowPropsType) => {
  const details = useAssetDetail(props.id, props.networkType);
  const hasDisplayId: boolean = props.id.trim().length > 0;
  return (
    <div style={{ width: props.width, flexGrow: 1 }}>
      <Box
        display="flex"
        alignItems={hasDisplayId ? 'flex-start' : 'center'}
        width="100%"
      >
        <Avatar alt={details.name} src={details.logoPath ?? '/'} />
        <Box sx={{ flexGrow: 1, minWidth: 0, ml: 2 }}>
          <Typography sx={{ flexGrow: 1 }}>{details.name}</Typography>
          {hasDisplayId && (
            <DisplayId
              variant="body2"
              color="textSecondary"
              id={props.id}
              sx={{ minWidth: 0 }}
            />
          )}
        </Box>
        {props.amount ? (
          <Typography sx={{ ml: 2, flexShrink: 0, textAlign: 'right' }}>
            <TokenAmountDisplay
              amount={BigInt(props.amount)}
              decimal={details.decimal}
              tokenId={props.id}
              showMonetaryValue={true}
            />
          </Typography>
        ) : undefined}
      </Box>
    </div>
  );
};

export default AssetRow;
