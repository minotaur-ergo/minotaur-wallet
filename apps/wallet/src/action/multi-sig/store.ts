import {
  MultiSigBriefRow,
  MultiSigDataHint,
  MultiSigDataRow,
  MultiSigHintType,
  StateWallet,
} from '@minotaur-ergo/types';
import * as wasm from '@minotaur/ergo-lib';

import store from '@/store';
import { setMultiSigLoadedTime } from '@/store/reducer/config';

import { deserialize, serialize } from '../box';
import { MultiSigDbAction, MultiStoreDbAction } from '../db';
import { extractErgAndTokenSpent } from '../tx';

const encoding = 'base64';

const multiSigStoreNewTx = async (
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  wallet: StateWallet,
) => {
  const serialized = Buffer.from(tx.sigma_serialize_bytes()).toString(encoding);
  const row = await MultiStoreDbAction.getInstance().insertMultiSigRow(
    wallet.id,
    tx.unsigned_tx().id().to_str(),
  );
  if (row) {
    await MultiStoreDbAction.getInstance().insertMultiSigTx(row, serialized);
    await MultiStoreDbAction.getInstance().insertMultiSigInputs(
      row,
      boxes.map((item) => serialize(item)),
    );
  }
};

const fetchMultiSigRows = async (
  wallet: StateWallet,
  txIds?: Array<string>,
): Promise<Array<MultiSigDataRow>> => {
  const rows = await MultiStoreDbAction.getInstance().getWalletRows(
    wallet.id,
    txIds,
  );
  const signerCount = (
    await MultiSigDbAction.getInstance().getWalletKeys(wallet.id)
  ).length;
  const res: Array<MultiSigDataRow> = [];
  for (const row of rows) {
    const reducedBytes = await MultiStoreDbAction.getInstance().getTx(row);
    const inputs = await MultiStoreDbAction.getInstance().getInputs(row);
    const hints = await MultiStoreDbAction.getInstance().getHints(
      row,
      inputs.length,
      signerCount,
    );
    res.push({
      rowId: row.id,
      requiredSign: wallet.requiredSign,
      tx: wasm.ReducedTransaction.sigma_parse_bytes(
        Buffer.from(reducedBytes, encoding),
      ),
      dataBoxes: [],
      boxes: inputs.map((item) => deserialize(item)),
      hints,
    });
  }
  return res;
};

/**
 * Retrieves a summarized list of multi-signature transactions for a wallet.
 *
 * This function fetches all multi-signature transactions associated with the specified
 * wallet and transforms them into a condensed format suitable for displaying in UI lists.
 * The returned data includes key transaction information such as signature counts,
 * transaction ID, and token/ERG transfer details.
 *
 * @param wallet - The wallet to fetch multi-signature transactions for
 * @returns A promise resolving to an array of summarized multi-signature transaction data
 */
const fetchMultiSigBriefRow = async (
  wallet: StateWallet,
): Promise<Array<MultiSigBriefRow>> => {
  return fetchMultiSigRows(wallet).then((rows) => {
    return rows.map((row) => {
      const transfer = extractErgAndTokenSpent(
        wallet,
        row.boxes,
        row.tx.unsigned_tx(),
      );
      return {
        rowId: row.rowId,
        committed: Math.min(
          ...row.hints.map(
            (hintRow) => hintRow.filter((hint) => hint.Commit !== '').length,
          ),
        ),
        signed: Math.min(
          ...row.hints.map(
            (hintRow) =>
              hintRow.filter(
                (hint) =>
                  hint.Proof !== '' && hint.Type === MultiSigHintType.Real,
              ).length,
          ),
        ),
        txId: row.tx.unsigned_tx().id().to_str(),
        tokensIn: Object.values(transfer.tokens).filter((item) => item > 0n)
          .length,
        tokensOut: Object.values(transfer.tokens).filter((item) => item < 0n)
          .length,
        ergIn: transfer.value < 0n ? -transfer.value : 0n,
        ergOut: transfer.value > 0n ? transfer.value : 0n,
      };
    });
  });
};

/**
 * Updates an existing multi-signature transaction row with new hint data.
 *
 * @param rowId - The ID of the multi-signature row to update
 * @param hints - 2D array of hint data organized by [inputIndex][signerIndex]
 * @param updateTime - Timestamp to set as the update time
 */
const updateMultiSigRow = async (
  rowId: number,
  hints: Array<Array<MultiSigDataHint>>,
  updateTime: number,
) => {
  const row = await MultiStoreDbAction.getInstance().getRowById(rowId);
  if (row) {
    await MultiStoreDbAction.getInstance().insertMultiSigHints(row, hints);
    store.dispatch(setMultiSigLoadedTime(updateTime));
  }
};

/**
 * Creates and stores a new multi-signature transaction with associated data
 * and hints. It performs a complete setup for a new multi-signature transaction
 * by coordinating several database operations.
 *
 * @param wallet - The wallet associated with this multi-signature transaction
 * @param tx - The reduced transaction to store
 * @param boxes - Array of input boxes used in the transaction
 * @param hints - 2D array of hint data organized by [inputIndex][signerIndex]
 * @param updateTime - Timestamp to set as the creation time
 * @returns The newly created multi-signature row, or undefined if creation failed
 */
const storeMultiSigRow = async (
  wallet: StateWallet,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  hints: Array<Array<MultiSigDataHint>>,
  updateTime: number,
) => {
  const row = await MultiStoreDbAction.getInstance().insertMultiSigRow(
    wallet.id,
    tx.unsigned_tx().id().to_str(),
  );
  if (row) {
    await MultiStoreDbAction.getInstance().insertMultiSigInputs(
      row,
      boxes.map(serialize),
    );
    await MultiStoreDbAction.getInstance().insertMultiSigTx(
      row,
      Buffer.from(tx.sigma_serialize_bytes()).toString(encoding),
    );
    await updateMultiSigRow(row.id, hints, updateTime);
  }
  return row;
};

export {
  multiSigStoreNewTx,
  fetchMultiSigRows,
  fetchMultiSigBriefRow,
  storeMultiSigRow,
  updateMultiSigRow,
};
