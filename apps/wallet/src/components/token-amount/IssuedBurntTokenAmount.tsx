import { Box } from '@mui/material';

import AssetRow from '@/components/asset-row/AssetRow';

interface issuedBurntTokenAmountPropsType {
  tokenId: 'erg' | string;
  amount: bigint;
  networkType: string;
  color: string;
}

const IssuedBurntTokenAmount = (props: issuedBurntTokenAmountPropsType) => {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 6,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor:
            props.color === 'success'
              ? 'success.light'
              : props.color === 'error'
                ? 'error.light'
                : 'primary.light',
        }}
      />
      <AssetRow
        id={props.tokenId}
        networkType={props.networkType}
        amount={props.amount}
      />
    </Box>
  );
};
export default IssuedBurntTokenAmount;
