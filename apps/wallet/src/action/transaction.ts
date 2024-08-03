import { deserialize } from './box';
import { AddressDbAction, BoxDbAction } from './db';

interface WalletTransactionType {
  txId: string;
  date: Date;
  ergIn: bigint;
  ergOut: bigint;
}

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
    txId: item.txId,
  }));
  for (const txRaw of result) {
    const boxes = await BoxDbAction.getInstance().getTxBoxes(
      txRaw.txId,
      addressIds,
    );
    for (const box of boxes) {
      const boxWasm = deserialize(box.serialized);
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

export type { WalletTransactionType };
