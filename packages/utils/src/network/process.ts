import * as wasm from '@minotaur-ergo/ergo-lib';
import { BoxInfo, SpendDetail } from '@minotaur-ergo/types';
import { V1 } from '@rosen-clients/ergo-explorer';
import { IndexedErgoTransaction } from '@rosen-clients/ergo-node';

import { JsonBI } from '../json';
import { serializeBox } from '../wasm';

const getBoxId = (box: { boxId?: string } | { id: string }) => {
  if (Object.prototype.hasOwnProperty.call(box, 'boxId'))
    return (box as { boxId: string }).boxId;
  return (box as { id: string }).id;
};

const processTransactionInput = async (
  tx: V1.TransactionInfo | V1.TransactionInfo1 | IndexedErgoTransaction,
  address: string,
  spendBox: (boxId: string, details: SpendDetail) => Promise<unknown>,
) => {
  await Promise.all(
    (tx.inputs ?? [])
      .filter((input) => input.address === address)
      .map((input) => {
        return spendBox(getBoxId(input), {
          height: tx.inclusionHeight,
          timestamp: parseInt(tx.timestamp.toString()),
          tx: tx.id,
          index: input.index ?? 0,
        });
      }),
  );
};

const processTransactionOutput = async (
  tx: V1.TransactionInfo | V1.TransactionInfo1 | IndexedErgoTransaction,
  address: string,
  insertOrUpdateBox: (box: BoxInfo) => Promise<unknown>,
) => {
  await Promise.all(
    (tx.outputs ?? [])
      .filter((output) => output.address === address)
      .map((output) => {
        return insertOrUpdateBox({
          address: output.address,
          boxId: getBoxId(output),
          create: {
            index: output.index ?? 0,
            tx: tx.id,
            height: tx.inclusionHeight,
            timestamp: parseInt(tx.timestamp.toString()),
          },
          serialized: serializeBox(
            wasm.ErgoBox.from_json(JsonBI.stringify(output)),
          ),
        });
      }),
  );
};

export { processTransactionOutput, processTransactionInput };
