import TokenAmountDisplay from './TokenAmountDisplay';

interface ErgAmountDisplayPropsType {
  amount: bigint;
  displayDecimal?: number;
  forceDisplay?: boolean;
}

const ErgAmountDisplay = (props: ErgAmountDisplayPropsType) => {
  return (
    <TokenAmountDisplay
      amount={props.amount}
      decimal={9}
      displayDecimal={props.displayDecimal}
      forceDisplay={props.forceDisplay}
    />
  );
};

export default ErgAmountDisplay;
