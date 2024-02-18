import { TokenType } from '@/types/tx';
import * as wasm from 'ergo-lib-wasm-browser';
import { useEffect, useState } from 'react';

const extractTokens = (
  wasmTokens: wasm.Tokens,
  tokens: Map<string, bigint>,
  sign: 1n | -1n,
) => {
  for (let tokenIndex = 0; tokenIndex < wasmTokens.len(); tokenIndex++) {
    const token = wasmTokens.get(tokenIndex);
    const tokenId = token.id().to_str();
    const amount = BigInt(token.amount().as_i64().to_str());
    tokens.set(tokenId, (tokens.get(tokenId) ?? 0n) + amount * sign);
  }
};

const useIssuedAndBurntTokens = (
  tx: wasm.UnsignedTransaction | wasm.Transaction,
  boxes: Array<wasm.ErgoBox>,
) => {
  const [issued, setIssued] = useState<Array<TokenType>>([]);
  const [burnt, setBurnt] = useState<Array<TokenType>>([]);
  const [storedTxId, setStoredTxId] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && storedTxId !== tx.id().to_str()) {
      setLoading(true);
      const inputs = tx.inputs();
      const tokens = new Map<string, bigint>();
      for (let index = 0; index < inputs.len(); index++) {
        const box = boxes.filter(
          (box) =>
            box.box_id().to_str() === inputs.get(index).box_id().to_str(),
        )[0];
        extractTokens(box.tokens(), tokens, -1n);
      }
      const outputCandidates = tx.output_candidates();
      for (let index = 0; index < outputCandidates.len(); index++) {
        extractTokens(outputCandidates.get(index).tokens(), tokens, 1n);
      }
      const issuedTokens: Array<TokenType> = [];
      const burntTokens: Array<TokenType> = [];
      for (const [tokenId, amount] of tokens.entries()) {
        if (amount > 0n) {
          issuedTokens.push({ tokenId, amount });
        } else if (amount < 0n) {
          burntTokens.push({ tokenId, amount: -amount });
        }
      }
      setIssued(issuedTokens);
      setBurnt(burntTokens);
      setStoredTxId(tx.id().to_str());
      setLoading(false);
    }
  }, [tx, boxes, storedTxId, loading]);
  return { issued, burnt };
};

export default useIssuedAndBurntTokens;
