import { useEffect, useState } from 'react';

import { DAppPropsType } from '@minotaur-ergo/types';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';

import { createErgToRsnOrder } from './action';
import {
  IMPLEMENTOR_FEE,
  IMPLEMENTOR_FEE_PERCENTAGE,
  MINIMUM_IMPLEMENTOR_FEE,
} from './parameters';

const ErgoDEX = (props: DAppPropsType) => {
  const [ergBalance, setErgBalance] = useState(0n);
  const [amount, setAmount] = useState(0n);
  const [amountHasError, setAmountHasError] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [generating, setGenerating] = useState(false);
  const implementorFee = IMPLEMENTOR_FEE(amount);
  const feeIsTooSmall = amount > 0n && implementorFee < MINIMUM_IMPLEMENTOR_FEE;

  useEffect(() => {
    let active = true;
    props
      .getTokenAmount()
      .then((balance) => {
        if (active) setErgBalance(balance);
      })
      .catch((error: unknown) => {
        if (active) {
          props.showNotification(
            `Failed to load ERG balance: ${error}`,
            'error',
          );
        }
      })
      .finally(() => {
        if (active) setLoadingBalance(false);
      });
    return () => {
      active = false;
    };
  }, [props]);

  const submitOrder = async () => {
    if (generating || amount <= 0n || amountHasError || feeIsTooSmall) return;
    setGenerating(true);
    try {
      await createErgToRsnOrder(props, amount);
    } catch (error) {
      props.showNotification(
        error instanceof Error ? error.message : String(error),
        'error',
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Stack spacing={2}>
        <Typography color="text.secondary">
          Swap ERG to RSN through the MEW Finance proxy. The proxy processes the
          swap in a separate transaction after you submit this order.
        </Typography>
        <TokenAmountInput
          network_type={props.networkType}
          amount={amount}
          setAmount={setAmount}
          total={ergBalance}
          tokenId="erg"
          setHasError={setAmountHasError}
        />
        {feeIsTooSmall ? (
          <Alert severity="warning">
            The 0.5% implementor fee must be at least{' '}
            <ErgAmountDisplay amount={MINIMUM_IMPLEMENTOR_FEE} /> ERG.
          </Alert>
        ) : undefined}
        <Box>
          <Typography color="text.secondary">
            Implementor fee ({IMPLEMENTOR_FEE_PERCENTAGE}%)
          </Typography>
          <Typography fontWeight={600}>
            <ErgAmountDisplay amount={implementorFee} /> ERG
          </Typography>
        </Box>
        <Alert severity="info">
          This initial version supports ERG → RSN only. Review the proxy
          transaction in the signing screen before approving it.
        </Alert>
      </Stack>
      <Box
        sx={{
          position: 'fixed',
          left: 16,
          right: 16,
          bottom: 16,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Button
          fullWidth
          disabled={
            loadingBalance ||
            generating ||
            amount <= 0n ||
            amountHasError ||
            feeIsTooSmall
          }
          onClick={() => submitOrder()}
        >
          {generating ? 'Preparing swap order…' : 'Swap ERG to RSN'}
        </Button>
      </Box>
    </Box>
  );
};

export default ErgoDEX;
