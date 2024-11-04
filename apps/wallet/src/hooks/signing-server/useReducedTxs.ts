import { getTxs } from '@/action/multi-sig-server';
import { extractErgAndTokenSpent } from '@/action/tx';
import Server from '@/db/entities/Server';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigBriefRow } from '@/types/multi-sig';
import { useEffect, useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';

const useReducedTxs = (
  server: Server | undefined,
  wallet: StateWallet,
  signer?: StateWallet,
) => {
  const [rows, setRows] = useState<MultiSigBriefRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedServerId, setLoadedServerId] = useState(-1);
  const [loadedSignerWalletId, setLoadedSignerWalletId] = useState(-1);
  useEffect(() => {
    if (!loading && server && signer) {
      console.log(loadedServerId, server.id, signer.id, loadedSignerWalletId);
      if (loadedServerId !== server.id || signer.id !== loadedSignerWalletId) {
        const loadingServerId = server.id;
        const loadingSignerWalletId = signer.id;
        setLoading(true);
        getTxs(server, signer?.xPub).then((res) => {
          const result: Array<MultiSigBriefRow> = res.map((row) => {
            const unsigned = wasm.ReducedTransaction.sigma_parse_bytes(
              Buffer.from(row.reduced, 'base64'),
            ).unsigned_tx();
            const transfer = extractErgAndTokenSpent(
              wallet,
              row.boxes.map((item) =>
                wasm.ErgoBox.sigma_parse_bytes(Buffer.from(item, 'base64')),
              ),
              unsigned,
            );
            return {
              rowId: row.id,
              signed: row.signed,
              committed: row.committed,
              txId: unsigned.id().to_str(),
              tokensIn: Object.values(transfer.tokens).filter(
                (item) => item > 0n,
              ).length,
              tokensOut: Object.values(transfer.tokens).filter(
                (item) => item < 0n,
              ).length,
              ergIn: transfer.value < 0n ? -transfer.value : 0n,
              ergOut: transfer.value > 0n ? transfer.value : 0n,
            };
          });
          setLoadedServerId(loadingServerId);
          setLoadedSignerWalletId(loadingSignerWalletId);
          setRows(result);
          setLoading(false);
        });
      }
    }
  }, [loadedSignerWalletId, loading, loadedServerId, wallet, server, signer]);
  return {
    rows,
    loading,
  };
};

export default useReducedTxs;
