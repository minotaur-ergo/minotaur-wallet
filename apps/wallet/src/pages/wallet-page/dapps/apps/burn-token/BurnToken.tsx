import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { AssetInfo, DAppPropsType } from '@/types/dapps';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import * as wasm from 'ergo-lib-wasm-browser';
import { createEmptyArrayWithIndex } from '@/utils/functions';

const fee = BigInt(1000000);

const BurnToken = (props: DAppPropsType) => {
  const [selectedToken, setSelectedToken] = useState<AssetInfo | undefined>();
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);
  const [amount, setAmount] = useState(0n);
  const burnToken = async () => {
    if (selectedToken && amount > 0) {
      const addresses = await props.getAddresses();
      const height = await props.chain.getNetwork().getHeight();
      const coveringBox = await props.getCoveringForErgAndToken(fee, [
        { id: selectedToken.id, amount: amount },
      ]);
      if (coveringBox.covered) {
        const boxes = coveringBox.boxes;
        const remainingTokens: { [id: string]: bigint } = {
          [selectedToken.id]: -amount,
        };
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
        burnToken.add(
          new wasm.Token(
            wasm.TokenId.from_str(selectedToken.id),
            wasm.TokenAmount.from_i64(wasm.I64.from_str(amount.toString())),
          ),
        );
        tx.set_token_burn_permit(burnToken);
        await props.signAndSendTx({ tx: tx.build(), boxes });
      } else {
        props.showNotification('Insufficient Ergs or Token to burn', 'error');
      }
    }
  };
  const selectToken = (event: SelectChangeEvent) => {
    const selected = tokens.filter((item) => item.id === event.target.value);
    setSelectedToken(selected.length > 0 ? selected[0] : undefined);
  };
  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        setLoaded(true);
        setTokens(tokens);
      });
    }
  });
  return (
    <Stack spacing={2}>
      <FormControl>
        <InputLabel id="selected-token-to-burn">Token</InputLabel>
        <Select
          value={selectedToken?.id ?? ''}
          label="Token"
          onChange={selectToken}
          labelId="selected-token-to-burn"
        >
          <MenuItem value="">No Token Selected</MenuItem>
          {tokens.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Typography>{item.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedToken ? (
        <TokenAmountInput
          network_type={props.chain.label}
          amount={amount}
          setAmount={(newAmount) => setAmount(newAmount)}
          total={selectedToken.amount}
          tokenId={selectedToken.id}
        />
      ) : null}
      <Button
        disabled={amount === 0n || selectedToken === undefined}
        onClick={burnToken}
      >
        Burn Token
      </Button>
    </Stack>
  );
};

export default BurnToken;
