import TokenAmountDisplay from './TokenAmountDisplay';

interface ErgAmountDisplayPropsType {
  amount: bigint;
  displayDecimal?: number;
  sign?: string;
}

const ErgAmountDisplay = (props: ErgAmountDisplayPropsType) => {
  return (
    <TokenAmountDisplay
      amount={props.amount}
      decimal={9}
      displayDecimal={props.displayDecimal}
      isBalance={true}
      sign={props.sign}
    />
  );
};

export default ErgAmountDisplay;
