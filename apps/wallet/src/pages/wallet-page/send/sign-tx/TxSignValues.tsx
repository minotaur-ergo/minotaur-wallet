import React, { useMemo } from 'react';

import { ErgoBox } from '@minotaur-ergo/ergo-lib';
import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet, TxStatus } from '@minotaur-ergo/types';
import { Avatar, Box, Typography } from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import AssetRow from '@/components/asset-row/AssetRow';
import UnBalancedTokensAmount from '@/components/token-amount/UnBalancedTokensAmount';
import TransactionResult from '@/components/tx/TransactionResult';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';
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
  const tokensCount = useMemo(
    () =>
      Object.entries(txValues.tokens).filter(([_, balance]) => balance !== 0n)
        .length,
    [txValues.tokens],
  );
  const tokenList = useMemo(
    () =>
      Array.from(Object.entries(txValues.tokens)).map(([tokenId, balance]) => ({
        tokenId,
        balance: -balance,
      })),
    [txValues.tokens],
  );
  const totalTokensInErg = useTokensTotalInErg(tokenList);
  return (
    <Box>
      {valuesDirection.outgoing ? (
        <React.Fragment>
          <Box display="flex" justifyContent="center">
            <Avatar
              src="/ergo.svg"
              alt="transaction icon"
              sx={{ width: '48px', height: '48px', borderRadius: '40px' }}
            />
          </Box>
          <Typography fontSize="2rem" textAlign="center">
            <ErgAmountDisplay
              amount={txValues.total > 0 ? txValues.total : -txValues.total}
              forceDisplay={true}
            />
            <Typography component="span" ml={1} color="text.secondary">
              ERG
            </Typography>
          </Typography>
          <Box display="flex" justifyContent="center" mb={2}>
            <TransactionResult
              totalTokensInErg={totalTokensInErg}
              amount={txValues.total}
              txType={valuesDirection.outgoing ? TxStatus.OUT : TxStatus.IN}
              withBg={true}
              forceDisplay={true}
            />
          </Box>
          {tokensCount > 0 && (
            <Box display="flex" alignItems="center" mb={1}>
              <Typography fontSize={14} color="textSecondary" fontWeight={600}>
                Tokens
              </Typography>
              <Box
                sx={{
                  ml: 1,
                  px: 0.75,
                  py: 0.5,
                  borderRadius: '4px',
                  bgcolor: '#0000000F',
                }}
              >
                <Typography fontSize={12} color="text.secondary">
                  {tokensCount}
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            marginTop={2}
            display="flex"
            flexDirection="column"
            sx={{ gap: 1 }}
            mb={2}
          >
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
