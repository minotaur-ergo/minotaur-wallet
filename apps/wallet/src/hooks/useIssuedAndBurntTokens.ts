import { useEffect, useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { TokenType } from '@minotaur-ergo/types';

import { boxesToJsonMap, JsonAsset, txToJson } from '@/utils/eip12';

const extractTokens = (
  assets: Array<JsonAsset>,
  tokens: Map<string, bigint>,
  sign: 1n | -1n,
) => {
  for (const asset of assets) {
    tokens.set(
      asset.tokenId,
      (tokens.get(asset.tokenId) ?? 0n) + BigInt(asset.amount) * sign,
    );
  }
};

const useIssuedAndBurntTokens = (
  tx: wasm.UnsignedTransaction | wasm.Transaction | undefined,
  boxes: Array<wasm.ErgoBox>,
) => {
  const [mapped, setMapped] = useState<Map<string, bigint>>(
    new Map<string, bigint>(),
  );
  const [issued, setIssued] = useState<Array<TokenType>>([]);
  const [burnt, setBurnt] = useState<Array<TokenType>>([]);
  const [storedTxId, setStoredTxId] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tx && !loading && storedTxId !== tx.id().to_str()) {
      setLoading(true);
      // convert to json once to avoid a wasm call per input and token
      const jsonTx = txToJson(tx);
      const jsonBoxes = boxesToJsonMap(boxes);
      const tokens = new Map<string, bigint>();
      jsonTx.inputs.forEach((input) => {
        const box = jsonBoxes.get(input.boxId);
        if (box) extractTokens(box.assets, tokens, -1n);
      });
      jsonTx.outputs.forEach((output) =>
        extractTokens(output.assets, tokens, 1n),
      );
      const issuedTokens: Array<TokenType> = [];
      const burntTokens: Array<TokenType> = [];
      const mappedTokens: Map<string, bigint> = new Map<string, bigint>();
      for (const [tokenId, amount] of tokens.entries()) {
        if (amount > 0n) {
          issuedTokens.push({ tokenId, amount });
        } else if (amount < 0n) {
          burntTokens.push({ tokenId, amount: -amount });
        }
        if (amount !== 0n) {
          mappedTokens.set(tokenId, amount);
        }
      }
      setIssued(issuedTokens);
      setBurnt(burntTokens);
      setMapped(mappedTokens);
      setStoredTxId(tx.id().to_str());
      setLoading(false);
    }
  }, [tx, boxes, storedTxId, loading]);
  return { issued, burnt, mapped };
};

export default useIssuedAndBurntTokens;
