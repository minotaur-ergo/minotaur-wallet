import { Typography } from '@mui/material';
import useAsset from '@/hooks/useAsset';
import TokenAmountDisplay from '../amounts-display/TokenAmountDisplay';

interface TokenAmountPropsType {
  tokenId: 'erg' | string;
  amount: bigint;
  networkType: string;
}

const TokenAmount = (props: TokenAmountPropsType) => {
  const asset = useAsset(props.tokenId, props.networkType);
  const getDecimal = () => {
    if (props.tokenId === 'erg') return 9;
    if (asset && asset.decimal) return asset.decimal;
    return 0;
  };
  return (
    <Typography fontSize="large">
      <TokenAmountDisplay amount={props.amount} decimal={getDecimal()} />
      &nbsp;
      <Typography component="span" variant="body2" color="textSecondary">
        {props.tokenId === 'erg'
          ? 'Erg'
          : asset && asset.name
            ? asset.name
            : props.tokenId.substring(0, 6) + '...'}
      </Typography>
    </Typography>
  );
};
export default TokenAmount;
