import { WalletTransactionType } from '@minotaur-ergo/types';

import { createEmptyArrayWithIndex } from '@/utils/functions';

import { deserialize } from './box';
import { AddressDbAction, BoxDbAction } from './db';

const getWalletTransactionsTotal = async (
  walletId: number,
): Promise<number> => {
  return (await BoxDbAction.getInstance().getWalletSortedTxIds(walletId))
    .length;
};
const getWalletTransactions = async (
  walletId: number,
  offset: number,
  limit: number,
): Promise<Array<WalletTransactionType>> => {
  const addressIds = (
    await AddressDbAction.getInstance().getWalletAddresses(walletId)
  ).map((item) => item.id);
  const txs = await BoxDbAction.getInstance().getWalletSortedTxIds(
    walletId,
    offset,
    limit,
  );
  const result = txs.map((item) => ({
    date: new Date(),
    ergIn: 0n,
    ergOut: 0n,
    tokens: new Map<string, bigint>(),
    txId: item.txId,
  }));
  for (const txRaw of result) {
    const boxes = await BoxDbAction.getInstance().getTxBoxes(
      txRaw.txId,
      addressIds,
    );
    for (const box of boxes) {
      const boxWasm = deserialize(box.serialized);
      const tokens = boxWasm.tokens();
      const sign = boxWasm.tx_id().to_str() === txRaw.txId ? 1n : -1n;
      createEmptyArrayWithIndex(tokens.len()).forEach((index) => {
        const token = tokens.get(index);
        const total =
          (txRaw.tokens.get(token.id().to_str()) ?? 0n) +
          sign * BigInt(token.amount().as_i64().to_str());
        txRaw.tokens.set(token.id().to_str(), total);
        if (total === 0n) {
          txRaw.tokens.delete(token.id().to_str());
        }
      });
      if (boxWasm.tx_id().to_str() === txRaw.txId) {
        txRaw.ergIn += BigInt(boxWasm.value().as_i64().to_str());
        txRaw.date = new Date(box.create_timestamp);
      } else {
        txRaw.ergOut += BigInt(boxWasm.value().as_i64().to_str());
        txRaw.date = box.spend_timestamp
          ? new Date(box.spend_timestamp)
          : new Date();
      }
    }
  }
  return result;
};

export { getWalletTransactions, getWalletTransactionsTotal };
