import { dottedText } from '@minotaur-ergo/utils';
import { Avatar, Box, Typography } from '@mui/material';

import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import useAssetDetail from '@/hooks/useAssetDetail';

interface BoxAssetRowPropsType {
  id: string;
  amount: bigint;
  networkType: string;
}

const BoxAssetRow = (props: BoxAssetRowPropsType) => {
  const details = useAssetDetail(props.id, props.networkType);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={1.5}
    >
      <Box display="flex" alignItems="center" gap={1.5} minWidth={0}>
        <Avatar
          alt={details.name}
          src={details.logoPath ?? '/'}
          sx={{ width: 32, height: 32 }}
        >
          {details.name?.[0] ?? 'T'}
        </Avatar>
        <Box minWidth={0}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, lineHeight: '20px' }}
          >
            {details.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'text.secondary',
              lineHeight: '18px',
            }}
          >
            {props.id ? dottedText(props.id, 10) : undefined}
          </Typography>
        </Box>
      </Box>

      <TokenAmountDisplay
        amount={props.amount}
        decimal={details.decimal}
        tokenId={props.id}
        showMonetaryValue={true}
        forceDisplay={true}
      />
    </Box>
  );
};

export default BoxAssetRow;
