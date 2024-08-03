import TokenAmountDisplay from './TokenAmountDisplay';

interface ErgAmountDisplayPropsType {
  amount: bigint;
  displayDecimal?: number;
}

const ErgAmountDisplay = (props: ErgAmountDisplayPropsType) => {
  return (
    <TokenAmountDisplay
      amount={props.amount}
      decimal={9}
      displayDecimal={props.displayDecimal}
    />
  );
};

export default ErgAmountDisplay;
