import { Alert, Typography } from '@mui/material';

import { formatWithDecimals } from '../utils';

interface PriceAlertPropsType {
  token: string;
  price: bigint;
  total: bigint;
  decimals: number;
  ratio: bigint;
}
const PriceAlert = (props: PriceAlertPropsType) => {
  return (
    <Alert severity="info" icon={false} sx={{ mb: 2 }}>
      <Typography gutterBottom>
        1 ERG = {formatWithDecimals(props.price, props.decimals)} {props.token}
      </Typography>
      <Typography>
        Circulatory Supply:&nbsp;
        <strong>{formatWithDecimals(props.total, props.decimals)}</strong>
      </Typography>
      <Typography fontSize={'90%'}>
        <br />
        Current Reserve Ratio:&nbsp;
        <strong>{props.ratio.toString()}%</strong>
      </Typography>
    </Alert>
  );
};

export default PriceAlert;
