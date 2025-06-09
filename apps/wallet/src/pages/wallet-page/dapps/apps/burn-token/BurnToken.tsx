import FillAmounts from '@/components/select-tokens/FillAmounts';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import { useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { DAppPropsType } from '@/types/dapps';
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
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);
  const [isValid, setIsValid] = useState(true);
  const [burning, setBurning] = useState(false);
  const burnToken = async () => {
    if (isValid && !burning) {
      setBurning(true);
      const address = await props.getDefaultAddress();
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
          wasm.Contract.pay_to_address(wasm.Address.from_base58(address)),
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
          wasm.Address.from_base58(address),
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
  }, [amounts, isValid]);
  return (
    <Stack spacing={2}>
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
      />
      <Button disabled={!isValid} onClick={burnToken}>
        Burn Token
      </Button>
    </Stack>
  );
};

export default BurnToken;
