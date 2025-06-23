import React from 'react';

import { TokenType } from '@minotaur-ergo/types';
import { Stack, Typography } from '@mui/material';

import IssuedBurntTokenAmount from './IssuedBurntTokenAmount';

interface UnBalancedTokensAmountPropsType {
  amounts: Array<TokenType>;
  label: string;
  color: string;
  networkType: string;
}

const UnBalancedTokensAmount = (props: UnBalancedTokensAmountPropsType) => {
  if (props.amounts.length > 0) {
    return (
      <React.Fragment>
        <Typography variant="body2" color="textSecondary">
          {props.label} Tokens
        </Typography>
        <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
          {props.amounts.map((item) => (
            <IssuedBurntTokenAmount
              amount={item.amount}
              color={props.color}
              networkType={props.networkType}
              tokenId={item.tokenId}
              key={item.tokenId}
            />
          ))}
        </Stack>
      </React.Fragment>
    );
  }
};

export default UnBalancedTokensAmount;
