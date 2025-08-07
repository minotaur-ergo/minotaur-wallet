import React from 'react';

import { ErgoBox } from '@minotaur-ergo/ergo-lib';
import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';
import { Box, FormHelperText, Typography } from '@mui/material';

import AssetRow from '@/components/asset-row/AssetRow';
import UnBalancedTokensAmount from '@/components/token-amount/UnBalancedTokensAmount';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import useTxValues from '@/hooks/useTxValues';

interface WalletSignNormalPropsType {
  tx: wasm.UnsignedTransaction | wasm.Transaction;
  boxes: Array<ErgoBox>;
  wallet: StateWallet;
}

const TxSignValues = (props: WalletSignNormalPropsType) => {
  const { issued, burnt } = useIssuedAndBurntTokens(props.tx, props.boxes);
  const { txValues, valuesDirection } = useTxValues(
    props.tx,
    props.boxes,
    props.wallet,
  );
  return (
    <Box>
      {valuesDirection.outgoing ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary">
            Total spent
          </Typography>
          <Box
            marginTop={2}
            display="flex"
            flexDirection="column"
            sx={{ gap: 1 }}
          >
            {txValues.total > 0 ? (
              <AssetRow
                amount={txValues.total}
                id={''}
                networkType={props.wallet.networkType}
              />
            ) : null}
            {Object.entries(txValues.tokens).map(([tokenId, value]) =>
              value > 0 ? (
                <AssetRow
                  id={tokenId}
                  amount={value}
                  networkType={props.wallet.networkType}
                  key={tokenId}
                />
              ) : null,
            )}
          </Box>
        </React.Fragment>
      ) : null}
      {valuesDirection.incoming ? (
        <React.Fragment>
          <Typography marginTop={4} variant="body2" color="textSecondary">
            Total Income
          </Typography>
          {txValues.total < 0 ? (
            <AssetRow
              id={''}
              amount={-txValues.total}
              networkType={props.wallet.networkType}
            />
          ) : null}
          {Object.entries(txValues.tokens).map(([tokenId, value]) =>
            value < 0 ? (
              <AssetRow
                id={tokenId}
                amount={-value}
                networkType={props.wallet.networkType}
                key={tokenId}
              />
            ) : null,
          )}
        </React.Fragment>
      ) : null}
      <FormHelperText sx={{ mb: 2 }}>
        These amount will be spent when transaction proceed.
      </FormHelperText>
      <UnBalancedTokensAmount
        amounts={burnt}
        color="error"
        label="Burning"
        networkType={props.wallet.networkType}
      />
      <UnBalancedTokensAmount
        amounts={issued}
        color="success"
        label="Issuing"
        networkType={props.wallet.networkType}
      />
    </Box>
  );
};

export default TxSignValues;
