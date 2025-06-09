import FillAmounts from '@/components/select-tokens/FillAmounts';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import React from 'react';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import { AssetInfo, DAppPropsType, TokenAmount } from '@/types/dapps';
import { readClipBoard } from '@/utils/clipboard';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { ContentPasteRounded } from '@mui/icons-material';

const TX_FEE = 2000000n;
const IMPL_FEE = 5000000n;

// 1211.29423243
const AirDrop = (props: DAppPropsType) => {
  const [addresses, setAddresses] = useState<Array<string>>([]);
  const [ergAmount, setErgAmount] = useState(0n);
  const [totalErg, setTotalErg] = useState(0n);
  const [lastTxt, setLastTxt] = useState('');
  const [amounts, setAmounts] = useState<TokenAmount>({});
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);

  const setAddressesStr = (addressesStr: string) => {
    const parts = addressesStr.split('\n');
    setLastTxt(parts[parts.length - 1] === '' ? '\n' : '');
    setAddresses(addressesStr.split('\n').filter((item) => item !== ''));
  };

  const paste = () => {
    readClipBoard().then(setAddressesStr);
  };

  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        props.getTokenAmount().then((res) => {
          setLoaded(true);
          setTotalErg(res - TX_FEE - IMPL_FEE);
        });
        setTokens(tokens);
      });
    }
  });
  const divisor = BigInt(Math.max(addresses.length, 1));
  return (
    <Stack spacing={2}>
      <TextField
        label="Addresses"
        value={addresses.join('\n') + lastTxt}
        onChange={(event) => setAddressesStr(event.target.value)}
        multiline
        minRows={3}
        maxRows={10}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" onClick={paste}>
              <IconButton edge="end">
                <ContentPasteRounded />
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText="Enter or paste addresses here, one per line"
        sx={{ '& .MuiInputBase-root': { alignItems: 'start' } }}
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
    </Stack>
  );
};

export default AirDrop;
