import { Box, Divider } from '@mui/material';
import PriceAlert from './PriceAlert';
import ActionPanel from './ActionPanel';
import Bank from '../Bank';
import Oracle from '../Oracle';
import { buyToken, sellToken } from '../utils';
import { DAppPropsType } from '@minotaur-ergo/types';

interface TabViewPropsType {
  price: bigint;
  bank: Bank;
  circulationSupply: bigint;
  oracle: Oracle;
  type: 'stable' | 'reserve';
  maxPurchase: bigint;
  maxRedeem: bigint;
  dappProps: DAppPropsType;
}

const TabView = (props: TabViewPropsType) => {
  const ratio = props.bank.currentReserveRatio();
  const buy = (amount: bigint) => {
    buyToken(props.type, amount, props.bank, props.oracle, props.dappProps)
      .then(() => null)
      .catch((e) => {
        props.dappProps.showNotification(e, 'error');
      });
  };

  const sell = (amount: bigint) => {
    sellToken(props.type, amount, props.bank, props.oracle, props.dappProps)
      .then(() => null)
      .catch((e) => {
        props.dappProps.showNotification(e, 'error');
      });
  };
  const tokenName = props.type === 'stable' ? 'SigUSD' : 'SigRSV';
  const decimals = props.type === 'stable' ? 2 : 0;
  return (
    <Box>
      <PriceAlert
        ratio={ratio}
        decimals={decimals}
        price={props.price}
        token={tokenName}
        total={props.circulationSupply}
      />
      <ActionPanel
        label="Purchase"
        action={buy}
        decimals={decimals}
        max={props.maxPurchase}
        name={tokenName}
      />

      <Divider sx={{ my: 2 }} />

      <ActionPanel
        label="Redeem"
        action={sell}
        decimals={decimals}
        max={props.maxRedeem}
        name={tokenName}
      />
    </Box>
  );
};

export default TabView;
