import AssetRow from '@/components/asset-row/AssetRow';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { AssetInfo, DAppPropsType } from '@/types/dapps';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import * as wasm from 'ergo-lib-wasm-browser';
import { createEmptyArrayWithIndex } from '@/utils/functions';

const fee = BigInt(1000000);

interface TokenAmount {
  [tokenId: string]: {
    amount: bigint;
    total: bigint;
  };
}

const BurnToken = (props: DAppPropsType) => {
  const [amounts, setAmounts] = useState<TokenAmount>({});
  const [name, setName] = useState('');
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [burning, setBurning] = useState(false);
  const burnToken = async () => {
    if (isValid && !burning) {
      setBurning(true);
      const addresses = await props.getAddresses();
      const height = await props.chain.getNetwork().getHeight();
      const selectedTokens = Object.entries(amounts).map((item) => ({
        id: item[0],
        amount: item[1].amount,
      }));
      const coveringBox = await props.getCoveringForErgAndToken(
        fee,
        selectedTokens,
      );
      if (coveringBox.covered) {
        const boxes = coveringBox.boxes;
        const remainingTokens: { [id: string]: bigint } = {};
        selectedTokens.forEach(
          (item) => (remainingTokens[item.id] = -item.amount),
        );
        const totalErg: bigint =
          createEmptyArrayWithIndex(boxes.len())
            .map((index) => {
              const box = boxes.get(index);
              const tokens = box.tokens();
              createEmptyArrayWithIndex(tokens.len()).forEach((token_index) => {
                const token = tokens.get(token_index);
                if (
                  Object.prototype.hasOwnProperty.call(
                    remainingTokens,
                    token.id().to_str(),
                  )
                ) {
                  remainingTokens[token.id().to_str()] += BigInt(
                    token.amount().as_i64().to_str(),
                  );
                } else {
                  remainingTokens[token.id().to_str()] = BigInt(
                    token.amount().as_i64().to_str(),
                  );
                }
              });
              return BigInt(box.value().as_i64().to_str());
            })
            .reduce((a, b) => a + b, BigInt(0)) - fee;
        const candidateBuilder = new wasm.ErgoBoxCandidateBuilder(
          wasm.BoxValue.from_i64(wasm.I64.from_str(totalErg.toString())),
          wasm.Contract.pay_to_address(wasm.Address.from_base58(addresses[0])),
          height,
        );
        Object.keys(remainingTokens).forEach((token_id) => {
          if (remainingTokens[token_id] > 0n) {
            candidateBuilder.add_token(
              wasm.TokenId.from_str(token_id),
              wasm.TokenAmount.from_i64(
                wasm.I64.from_str(remainingTokens[token_id].toString()),
              ),
            );
          }
        });
        const candidate = candidateBuilder.build();
        const tx = wasm.TxBuilder.new(
          new wasm.BoxSelection(boxes, new wasm.ErgoBoxAssetsDataList()),
          new wasm.ErgoBoxCandidates(candidate),
          height,
          wasm.BoxValue.from_i64(wasm.I64.from_str(fee.toString())),
          wasm.Address.from_base58(addresses[0]),
        );
        const burnToken = new wasm.Tokens();
        selectedTokens.forEach((item) => {
          burnToken.add(
            new wasm.Token(
              wasm.TokenId.from_str(item.id),
              wasm.TokenAmount.from_i64(
                wasm.I64.from_str(item.amount.toString()),
              ),
            ),
          );
        });
        tx.set_token_burn_permit(burnToken);
        await props.signAndSendTx({ tx: tx.build(), boxes });
      } else {
        props.showNotification('Insufficient Ergs or Token to burn', 'error');
      }
      setBurning(false);
    }
  };
  const selectToken = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const keys = typeof value === 'string' ? value.split(',') : value;
    const newAmounts: TokenAmount = {};
    keys.forEach((key) => {
      newAmounts[key] = amounts[key] ?? { amount: 0n, total: 0n };
    });
    const searchKey = keys.length === 1 ? keys[0] : undefined;
    const foundToken = tokens.filter((token) => token.id === searchKey);
    const name =
      foundToken.length > 0
        ? foundToken[0].name
        : searchKey
          ? searchKey.substring(0, 5) + '...'
          : null;
    tokens.forEach((token) => {
      if (keys.includes(token.id)) {
        newAmounts[token.id].total = token.amount;
      }
    });
    setName(name ? name : keys.length > 1 ? 'Multiple Tokens' : '');
    setSelectedTokenIds(keys);
    setAmounts(newAmounts);
  };
  const setAmount = (tokenId: string, amount: bigint) => {
    setAmounts((oldValue) => ({
      ...oldValue,
      [tokenId]: { ...oldValue[tokenId], amount },
    }));
  };
  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        setLoaded(true);
        setTokens(tokens);
      });
    }
  });
  useEffect(() => {
    let total = 0n;
    let isAmountsValid = true;
    Object.values(amounts).forEach((amount) => {
      total += amount.amount;
      isAmountsValid =
        isAmountsValid && amount.total >= amount.amount && amount.amount >= 0n;
    });
    if (isValid !== (isAmountsValid && total > 0n)) {
      setIsValid(isAmountsValid && total > 0n);
    }
  }, [amounts]);
  return (
    <Stack spacing={2}>
      <FormControl>
        <InputLabel id="selected-token-to-burn">Token</InputLabel>
        <Select
          value={selectedTokenIds}
          label="Token"
          multiple
          onChange={selectToken}
          renderValue={() => `${name}`}
          labelId="selected-token-to-burn"
        >
          {tokens.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={selectedTokenIds.includes(item.id)} />
              <AssetRow
                id={item.id}
                amount=""
                networkType={props.chain.label}
                width={'calc(100% - 44px)'}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedTokenIds.map((row) => {
        return (
          <TokenAmountInput
            key={row}
            network_type={props.chain.label}
            amount={amounts[row].amount}
            setAmount={(newAmount) => setAmount(row, newAmount)}
            total={amounts[row].total}
            tokenId={row}
          />
        );
      })}
      <Button disabled={!isValid} onClick={burnToken}>
        Burn Token
      </Button>
    </Stack>
  );
};

export default BurnToken;
