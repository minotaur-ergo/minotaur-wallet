import React from 'react';

import { ChainTypeInterface, TokenAmount } from '@minotaur-ergo/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton } from '@mui/material';

import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';

interface FillAmountsPropsType {
  amounts: TokenAmount;
  setAmounts: React.Dispatch<React.SetStateAction<TokenAmount>>;
  tokenIds: Array<string>;
  chain: ChainTypeInterface;
  setTokenIds: React.Dispatch<React.SetStateAction<Array<string>>>;
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

  const removeToken = (tokenId: string) => {
    props.setTokenIds(props.tokenIds.filter((t) => t !== tokenId));
    props.setAmounts((oldValue) => {
      const newValue = { ...oldValue };
      delete newValue[tokenId];
      return newValue;
    });
  };

  return props.tokenIds.map((row) => {
    return (
      <Box
        key={row}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.75,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TokenAmountInput
            network_type={props.chain.label}
            amount={props.amounts[row].amount}
            setAmount={(newAmount) => setAmount(row, newAmount)}
            total={getTotal(row)}
            tokenId={row}
            setHasError={(hasError) => setAmountError(row, hasError)}
            availableLabel={props.availableLabel}
          />
        </Box>
        <IconButton
          onClick={() => removeToken(row)}
          aria-label="delete token"
          sx={{
            'mt': 1,
            'color': 'text.secondary',
            'p': 1,
            '& .MuiSvgIcon-root': {
              fontSize: 26,
            },
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
    );
  });
};

export default FillAmounts;
