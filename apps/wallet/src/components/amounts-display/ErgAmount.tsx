import TokenAmountDisplay from './TokenAmountDisplay';

interface ErgAmountDisplayPropsType {
  amount: bigint;
  displayDecimal?: number;
  showBalances: boolean;
}

const ErgAmountDisplay = (props: ErgAmountDisplayPropsType) => {
  return (
    <TokenAmountDisplay
      amount={props.amount}
      decimal={9}
      displayDecimal={props.displayDecimal}
      hide={!props.showBalances}
    />
  );
};

export default ErgAmountDisplay;
