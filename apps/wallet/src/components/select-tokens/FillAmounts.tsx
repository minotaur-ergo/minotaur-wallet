import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import { TokenAmount, ChainTypeInterface } from '@minotaur-ergo/types';
import React from 'react';

interface FillAmountsPropsType {
  amounts: TokenAmount;
  setAmounts: React.Dispatch<React.SetStateAction<TokenAmount>>;
  tokenIds: Array<string>;
  chain: ChainTypeInterface;
  totalCalculator?: (amount: bigint) => bigint;
  availableLabel?: string;
}

const FillAmounts = (props: FillAmountsPropsType) => {
  const setAmount = (tokenId: string, amount: bigint) => {
    props.setAmounts((oldValue) => ({
      ...oldValue,
      [tokenId]: { ...oldValue[tokenId], amount },
    }));
  };

  const setAmountError = (tokenId: string, hasError: boolean) => {
    props.setAmounts((oldValue) => ({
      ...oldValue,
      [tokenId]: { ...oldValue[tokenId], hasError },
    }));
  };
  const getTotal = (tokenId: string) => {
    if (props.totalCalculator) {
      return props.totalCalculator(props.amounts[tokenId].total);
    }
    return props.amounts[tokenId].total;
  };
  return props.tokenIds.map((row) => {
    return (
      <TokenAmountInput
        key={row}
        network_type={props.chain.label}
        amount={props.amounts[row].amount}
        setAmount={(newAmount) => setAmount(row, newAmount)}
        total={getTotal(row)}
        tokenId={row}
        setHasError={(hasError) => setAmountError(row, hasError)}
        availableLabel={props.availableLabel}
      />
    );
  });
};

export default FillAmounts;
