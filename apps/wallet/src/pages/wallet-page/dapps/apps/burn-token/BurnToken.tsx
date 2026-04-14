import { useEffect, useMemo, useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { DAppPropsType, TokenAmount } from '@minotaur-ergo/types';
import { createEmptyArrayWithIndex } from '@minotaur-ergo/utils';
import { Box, Button, Divider, Stack } from '@mui/material';

import FillAmounts from '@/components/select-tokens/FillAmounts';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import { useTokensTotalInErg } from '@/hooks/useTokensTotalInErg';

import BurnConfirm from './BurnConfirm';

const fee = BigInt(1000000);

const BurnToken = (props: DAppPropsType) => {
  const [amounts, setAmounts] = useState<TokenAmount>({});
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);
  const [isValid, setIsValid] = useState(false);
  const [burning, setBurning] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [tokensValue, setTokensValue] = useState<bigint>(0n);

  const tokenBalancesForValue = useMemo(
    () =>
      Object.entries(amounts).map(([tokenId, v]) => ({
        tokenId,
        balance: v.amount,
      })),
    [amounts],
  );

  const tokensTotalInErg = useTokensTotalInErg(tokenBalancesForValue);

  const handleBurn = () => {
    if (isValid && !burning) {
      if (tokensTotalInErg) {
        setTokensValue(tokensTotalInErg);
        setShowConfirm(true);
      } else {
        burnToken();
      }
    }
  };

  const burnToken = async () => {
    setBurning(true);
    const address = await props.getDefaultAddress();
    const height = await props.chain.getNetwork().getHeight();
    const selectedTokens = Object.entries(amounts).map((item) => ({
      tokenId: item[0],
      balance: item[1].amount,
    }));
    const coveringBox = await props.getCoveringForErgAndToken(
      fee,
      selectedTokens,
    );
    if (coveringBox.covered) {
      const boxes = coveringBox.boxes;
      const remainingTokens: { [id: string]: bigint } = {};
      selectedTokens.forEach((item) => {
        remainingTokens[item.tokenId] = -item.balance;
      });
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
            wasm.TokenId.from_str(item.tokenId),
            wasm.TokenAmount.from_i64(
              wasm.I64.from_str(item.balance.toString()),
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
  };

  useEffect(() => {
    let total = 0n;
    let isAmountsValid = true;
    let hasValue = true;
    Object.values(amounts).forEach((amount) => {
      if (amount.hasError || !amount.amount) {
        hasValue = false;
      } else {
        total += amount.amount;
        isAmountsValid =
          isAmountsValid &&
          amount.total >= amount.amount &&
          amount.amount >= 0n;
      }
    });
    if (isValid !== (hasValue && isAmountsValid && total > 0n)) {
      setIsValid(hasValue && isAmountsValid && total > 0n);
    }
  }, [amounts, isValid]);

  return (
    <Box sx={{ pb: 10 }}>
      <BurnConfirm
        open={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          burnToken();
        }}
        onClose={() => {
          setShowConfirm(false);
        }}
        value={tokensValue}
      />
      <Stack spacing={2}>
        <SelectTokens
          amounts={amounts}
          setAmounts={setAmounts}
          tokenIds={selectedTokenIds}
          setTokenIds={setSelectedTokenIds}
          getAssets={props.getAssets}
          chain={props.chain}
        />
        <Divider />
        <FillAmounts
          amounts={amounts}
          setAmounts={setAmounts}
          tokenIds={selectedTokenIds}
          setTokenIds={setSelectedTokenIds}
          chain={props.chain}
        />
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
          disabled={!isValid}
          onClick={handleBurn}
          sx={{ bgcolor: 'error.main', fontSize: 16, fontWeight: 600 }}
        >
          {`Burn ${selectedTokenIds.length > 0 ? selectedTokenIds.length : ''} Token`}
        </Button>
      </Box>
    </Box>
  );
};

export default BurnToken;
