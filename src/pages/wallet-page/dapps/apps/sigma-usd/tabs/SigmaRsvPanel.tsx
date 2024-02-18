import Bank from '../Bank';
import Oracle from '../Oracle';
import { DAppPropsType } from '@/types/dapps';
import TabView from './TabView';

interface SigmaRsvPanelPropsType {
  bank: Bank;
  oracle: Oracle;
  dappProps: DAppPropsType;
}

const SigmaRsvPanel = (props: SigmaRsvPanelPropsType) => {
  const price = BigInt(1e9) / props.bank.reserveCoinNominalPrice();
  const maxPurchase = props.bank.numAbleToMintReserveCoin();
  const maxRedeem = props.bank.numAbleToRedeemReserveCoin();
  return (
    <TabView
      maxPurchase={maxPurchase}
      maxRedeem={maxRedeem}
      price={price}
      type="reserve"
      bank={props.bank}
      circulationSupply={props.bank.numCirculatingReserveCoins()}
      dappProps={props.dappProps}
      oracle={props.oracle}
    />
  );
};

export default SigmaRsvPanel;
