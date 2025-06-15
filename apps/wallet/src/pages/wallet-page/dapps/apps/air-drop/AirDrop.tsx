import FillAmounts from '@/components/select-tokens/FillAmounts';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import { airdrop } from '@/pages/wallet-page/dapps/apps/air-drop/action';
import Addresses from '@/pages/wallet-page/dapps/apps/air-drop/Addresses';
import useTokens from '@/pages/wallet-page/dapps/apps/air-drop/useTokens';
import React from 'react';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import { DAppPropsType, TokenAmount } from '@/types/dapps';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';

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
  console.log(amounts);
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
  return (
    <Stack spacing={2}>
      <Addresses
        addresses={addresses}
        network={props.chain.prefix}
        setAddresses={setAddresses}
        setHasError={setAddressError}
      />
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
            chain={props.chain}
            totalCalculator={(amount) => amount / divisor}
            availableLabel="allowed each"
          />
        </React.Fragment>
      ) : undefined}
      <Button onClick={() => airDropClick().then(() => null)} disabled={error}>
        Air Drop
      </Button>
    </Stack>
  );
};

export default AirDrop;
