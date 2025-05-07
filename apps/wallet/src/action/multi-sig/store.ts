import * as wasm from 'ergo-lib-wasm-browser';
import { MultiSigTxType } from '@/db/entities/multi-sig/MultiSignTx';
import { MultiSigBriefRow, MultiSigDataRow } from '@/types/multi-sig';
import store from '@/store';
import { setMultiSigLoadedTime } from '@/store/reducer/config';
import { StateWallet } from '@/store/reducer/wallet';
import { deserialize, serialize } from '../box';
import { MultiSigDbAction, MultiStoreDbAction } from '../db';
import { extractErgAndTokenSpent, getTxBoxes } from '../tx';
import getChain from '@/utils/networks';

const encoding = 'base64';

/**
 * Stores a new multi-signature transaction in the database.
 *
 * This function creates a new row in the database for a multi-signature transaction
 * and stores the reduced transaction and its input boxes. It does not store any
 * commitments, hints, or signatures - it only initializes the basic transaction data.
 *
 * @param tx - The reduced transaction to store
 * @param boxes - The boxes used as inputs in the transaction
 * @param wallet - The wallet that owns the transaction
 */
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
    await MultiStoreDbAction.getInstance().insertMultiSigTx(
      row,
      serialized,
      MultiSigTxType.Reduced,
    );
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
    const reducedBytes = await MultiStoreDbAction.getInstance().getTx(
      row,
      MultiSigTxType.Reduced,
    );
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
      hints: hints.hints,
      secrets: hints.secrets,
      signed: [],
    });
  }
  return res;
};

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
        signed: row.signed.filter((item) => item !== '').length,
        committed: Math.min(
          ...row.hints.map(
            (hintRow) => hintRow.filter((hint) => hint !== '').length,
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
 * Finds addresses used in a transaction that are not available in the wallet.
 *
 * This function checks if all addresses used in a transaction's inputs (that have hints)
 * are available in the wallet. It returns a list of addresses that are used in the transaction
 * but not found in the wallet, which indicates that the wallet cannot sign for those inputs.
 *
 * @param wallet - The wallet to check addresses against
 * @param hints - 2D array of hints for each input
 * @param tx - The unsigned transaction to check
 * @param boxes - The boxes used as inputs in the transaction
 * @returns Array of addresses that are used in the transaction but not available in the wallet
 */
const notAvailableAddresses = (
  wallet: StateWallet,
  hints: Array<Array<string>>,
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
) => {
  const prefix = getChain(wallet.networkType).prefix;
  const boxAddresses = getTxBoxes(tx, boxes)
    .filter((_item, index) => hints[index].some((item) => item !== ''))
    .map((item) =>
      wasm.Address.recreate_from_ergo_tree(item.ergo_tree()).to_base58(prefix),
    );
  const walletAddressSet = new Set(
    wallet.addresses.map((item) => item.address),
  );
  return boxAddresses.filter((item) => !walletAddressSet.has(item));
};

/**
 * Updates an existing multi-signature transaction row using the new hint format.
 *
 * This function updates an existing multi-signature transaction row in the database
 * using the new hint format. It only updates the hints and secrets, without modifying
 * any other data like partial transactions.
 *
 * @param rowId - The ID of the row to update
 * @param hints - 2D array of hints in the new format
 * @param secrets - 2D array of secrets corresponding to the hints
 * @param updateTime - The timestamp for when the row was updated
 */
const updateMultiSigRowNew = async (
  rowId: number,
  hints: Array<Array<string>>,
  secrets: Array<Array<string>>,
  updateTime: number,
) => {
  const row = await MultiStoreDbAction.getInstance().getRowById(rowId);
  if (row) {
    // Store the hints and secrets
    await MultiStoreDbAction.getInstance().insertMultiSigHints(
      row,
      hints,
      secrets,
    );

    // Update the last loaded time in the store
    store.dispatch(setMultiSigLoadedTime(updateTime));
  }
};

/**
 * Stores a new multi-signature transaction row using the new hint format.
 *
 * This function creates a new multi-signature transaction row in the database
 * using the new hint format. It stores the transaction, boxes, and hints in the database.
 *
 * @param wallet - The wallet that owns the transaction
 * @param tx - The reduced transaction to store
 * @param boxes - The boxes used as inputs in the transaction
 * @param hints - 2D array of hints in the new format
 * @param secrets - 2D array of secrets corresponding to the hints
 * @param updateTime - The timestamp for when the row was updated
 * @returns The created MultiSignRow or undefined if creation failed
 */
const storeMultiSigRowNew = async (
  wallet: StateWallet,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  hints: Array<Array<string>>,
  secrets: Array<Array<string>>,
  updateTime: number,
) => {
  // Create a new row in the database
  const row = await MultiStoreDbAction.getInstance().insertMultiSigRow(
    wallet.id,
    tx.unsigned_tx().id().to_str(),
  );

  if (row) {
    // Store the transaction inputs
    await MultiStoreDbAction.getInstance().insertMultiSigInputs(
      row,
      boxes.map(serialize),
    );

    // Store the reduced transaction
    await MultiStoreDbAction.getInstance().insertMultiSigTx(
      row,
      Buffer.from(tx.sigma_serialize_bytes()).toString(encoding),
      MultiSigTxType.Reduced,
    );

    // Store the hints and secrets
    await MultiStoreDbAction.getInstance().insertMultiSigHints(
      row,
      hints,
      secrets,
    );

    // Update the last loaded time in the store
    store.dispatch(setMultiSigLoadedTime(updateTime));
  }

  return row;
};

export {
  multiSigStoreNewTx,
  fetchMultiSigRows,
  fetchMultiSigBriefRow,
  storeMultiSigRowNew,
  notAvailableAddresses,
  updateMultiSigRowNew,
};
