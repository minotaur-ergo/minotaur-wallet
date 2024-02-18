import { Box, Typography } from '@mui/material';
import { tokenStr } from '../../utils/functions';
import useAsset from '@/hooks/useAsset';

interface issuedBurntTokenAmountPropsType {
  tokenId: 'erg' | string;
  amount: bigint;
  networkType: string;
  color: string;
}

const IssuedBurntTokenAmount = (props: issuedBurntTokenAmountPropsType) => {
  const asset = useAsset(props.tokenId, props.networkType);
  const getDecimal = () => {
    if (props.tokenId === 'erg') return 9;
    if (asset && asset.decimal) return asset.decimal;
    return 0;
  };
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
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {props.tokenId === 'erg'
          ? 'Erg'
          : asset && asset.name
            ? asset.name
            : props.tokenId.substring(0, 6) + '...'}
      </Typography>
      <Typography variant="body2">
        {tokenStr(props.amount, getDecimal())}
      </Typography>
    </Box>
  );
};
export default IssuedBurntTokenAmount;
