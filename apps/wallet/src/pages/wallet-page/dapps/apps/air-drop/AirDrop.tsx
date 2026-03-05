import React, { useMemo } from 'react';
import { useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { DAppPropsType, TokenAmount } from '@minotaur-ergo/types';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import BalanceDisplay from '@/components/balance-display/BalanceDisplay';
import FillAmounts from '@/components/select-tokens/FillAmounts';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';
import { airdrop } from '@/pages/wallet-page/dapps/apps/air-drop/action';
import Addresses from '@/pages/wallet-page/dapps/apps/air-drop/Addresses';
import useTokens from '@/pages/wallet-page/dapps/apps/air-drop/useTokens';

const AirDrop = (props: DAppPropsType) => {
  const [addresses, setAddresses] = useState<Array<string>>(['']);
  const [ergAmount, setErgAmount] = useState(0n);
  const [amounts, setAmounts] = useState<TokenAmount>({});
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);
  const [addressError, setAddressError] = useState(false);
  const [acting, setActing] = useState(false);
  const { tokens, totalErg } = useTokens(props);

  const divisor = BigInt(Math.max(addresses.length, 1));
  const ergError = !(
    ergAmount < totalErg &&
    ergAmount >= BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str())
  );
  const tokensError = Object.keys(amounts)
    .map((item) => amounts[item].hasError)
    .reduce((a, b) => a || b, false);
  const error = ergError || tokensError || addressError;
  const airDropClick = async () => {
    if (!acting && !error) {
      setActing(true);
      await airdrop(props, addresses, amounts, ergAmount);
      setActing(false);
    }
  };
  const tokenList = useMemo(
    () =>
      Object.entries(amounts).map(([tokenId, v]) => ({
        tokenId,
        balance: v.amount.toString(),
      })),
    [amounts],
  );
  const tokensTotalValue = useTokensTotalInErg(tokenList);
  const totalToSend = ergAmount + tokensTotalValue;
  return (
    <Box sx={{ pb: 24 }}>
      <Stack spacing={2}>
        <Addresses
          addresses={addresses}
          network={props.chain.prefix}
          setAddresses={setAddresses}
          setHasError={setAddressError}
        />
        <Divider />
        <TokenAmountInput
          network_type={props.chain.label}
          amount={ergAmount}
          setAmount={(newAmount) => setErgAmount(newAmount)}
          total={totalErg / BigInt(Math.max(addresses.length, 1))}
          tokenId="erg"
          availableLabel="allowed each"
        />
        {tokens.length > 0 ? (
          <React.Fragment>
            <SelectTokens
              amounts={amounts}
              setAmounts={setAmounts}
              tokenIds={selectedTokenIds}
              setTokenIds={setSelectedTokenIds}
              getAssets={props.getAssets}
              chain={props.chain}
            />
            <FillAmounts
              amounts={amounts}
              setAmounts={setAmounts}
              tokenIds={selectedTokenIds}
              setTokenIds={setSelectedTokenIds}
              chain={props.chain}
              totalCalculator={(amount) => amount / divisor}
              availableLabel="allowed each"
            />
          </React.Fragment>
        ) : undefined}
      </Stack>
      <Box
        sx={{
          position: 'fixed',
          left: 16,
          right: 16,
          bottom: 16,
          zIndex: 1000,
          bgcolor: '#fff',
        }}
      >
        <Box
          sx={{
            borderRadius: 1,
            px: 1,
            py: 1,
            mb: 1,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="text.secondary" fontSize={14} fontWeight={500}>
              Number of addresses
            </Typography>
            <Typography color="text.primary" fontSize={16} fontWeight={500}>
              {addresses.length}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={0.5}
          >
            <Typography color="text.secondary" fontSize={14} fontWeight={500}>
              Amount per airdrop
            </Typography>
            <Typography
              component="span"
              color="text.primary"
              fontSize={16}
              fontWeight={600}
            >
              <ErgAmountDisplay amount={totalToSend} displayDecimal={2} />
              <Typography
                component="span"
                color="text.secondary"
                fontSize={14}
                ml={1}
              >
                ERG
              </Typography>
              <Typography
                component="span"
                color="text.secondary"
                fontSize={14}
                ml={1}
              >
                (
                <BalanceDisplay amount={totalToSend} tokenBalances={[]} />)
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="text.primary" fontSize={14} fontWeight={600}>
              Total to send
            </Typography>
            <Typography
              component="span"
              color="text.primary"
              fontSize={16}
              fontWeight={600}
            >
              <ErgAmountDisplay
                amount={totalToSend * divisor}
                displayDecimal={2}
              />
              <Typography
                component="span"
                color="text.secondary"
                fontSize={14}
                ml={1}
              >
                ERG
              </Typography>
              <Typography
                component="span"
                color="text.secondary"
                fontSize={14}
                ml={1}
              >
                (
                <BalanceDisplay
                  amount={totalToSend * divisor}
                  tokenBalances={[]}
                />
                )
              </Typography>
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          onClick={() => airDropClick().then(() => null)}
          disabled={error}
        >
          Air Drop
        </Button>
      </Box>
    </Box>
  );
};

export default AirDrop;
