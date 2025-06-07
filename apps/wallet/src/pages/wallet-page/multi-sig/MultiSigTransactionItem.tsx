import { Box, Card, CardActionArea, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DisplayId from '@/components/display-id/DisplayId';
import { getRoute, RouteMap } from '@/router/routerMap';
import { StateWallet } from '@/store/reducer/wallet';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';

interface MultiSigTransactionItemPropsType {
  wallet: StateWallet;
  txId: string;
  ergIn: bigint;
  ergOut: bigint;
  tokensIn: number;
  tokensOut: number;
  commitments: number;
  signs: number;
}

const MultiSigTransactionItem = (props: MultiSigTransactionItemPropsType) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const requiredSign = props.wallet.requiredSign;
  const getState = () => {
    if (props.signs >= requiredSign) {
      return {
        title: 'Ready to publish',
        color: theme.palette.success.dark,
        step: requiredSign,
      };
    }
    if (props.commitments < requiredSign) {
      return {
        title: 'Need Commitments',
        color: theme.palette.warning.dark,
        step: props.commitments,
      };
    }
    return {
      title: 'Signing',
      color: theme.palette.primary.dark,
      step: props.signs,
    };
  };
  const rowState = getState();
  const route = getRoute(RouteMap.WalletMultiSigTxView, {
    id: props.wallet.id,
    txId: props.txId,
  });
  return (
    <Card>
      <CardActionArea sx={{ p: 2 }} onClick={() => navigate(route)}>
        <Box display="flex" mb={1}>
          <Typography sx={{ flexGrow: 1, color: rowState.color }}>
            {rowState.title}
          </Typography>
          {rowState.step >= 0 ? (
            <Typography>
              {rowState.step} <small>/ {requiredSign}</small>
            </Typography>
          ) : undefined}
        </Box>
        {props.tokensIn > 0 || props.ergIn > 0n ? (
          <Typography variant="body2" color="textSecondary">
            Income:
            <ErgAmountDisplay amount={props.ergIn} />
            <small>ERG</small>{' '}
            {props.tokensIn ? ` And ${props.tokensIn} Tokens` : null}
          </Typography>
        ) : null}
        {props.tokensOut > 0 || props.ergOut > 0n ? (
          <Typography variant="body2" color="textSecondary">
            Spent:
            <ErgAmountDisplay amount={props.ergOut} />
            <small>ERG</small>{' '}
            {props.tokensOut ? ` And ${props.tokensOut} Tokens` : null}
          </Typography>
        ) : null}
        <DisplayId variant="body2" color="textSecondary" id={props.txId} />
      </CardActionArea>
    </Card>
  );
};

export default MultiSigTransactionItem;
