import Bank from '../Bank';
import Oracle from '../Oracle';
import { DAppPropsType } from '@minotaur-ergo/types';
import TabView from './TabView';

interface SigmaUsdPanelPropsType {
  bank: Bank;
  oracle: Oracle;
  dappProps: DAppPropsType;
}

const SigmaUsdPanel = (props: SigmaUsdPanelPropsType) => {
  const price = BigInt(1e9) / props.bank.stableCoinNominalPrice();
  const circulationSupply = props.bank.numCirculatingStableCoins();
  const maxPurchase = props.bank.numAbleToMintStableCoin();
  const maxRedeem = props.bank.numCirculatingStableCoins();
  return (
    <TabView
      maxPurchase={maxPurchase}
      maxRedeem={maxRedeem}
      price={price}
      type="stable"
      bank={props.bank}
      circulationSupply={circulationSupply}
      dappProps={props.dappProps}
      oracle={props.oracle}
    />
  );
};

export default SigmaUsdPanel;
