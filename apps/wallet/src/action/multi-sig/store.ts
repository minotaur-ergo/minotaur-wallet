import * as wasm from 'ergo-lib-wasm-browser';
import { MultiSigTxType } from '@/db/entities/multi-sig/MultiSigTx';
import { MultiSigBriefRow, MultiSigDataRow } from '@/types/multi-sig-old';
import store from '@/store';
import { setMultiSigLoadedTime } from '@/store/reducer/config';
import { StateWallet } from '@/store/reducer/wallet';
import { deserialize, serialize } from '../box';
import { MultiSigDbAction, MultiStoreDbAction } from '../db';
import { extractErgAndTokenSpent, getTxBoxes } from '../tx';
import getChain from '@/utils/networks';

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
    const partialBytes = await MultiStoreDbAction.getInstance().getTx(
      row,
      MultiSigTxType.Partial,
    );
    const inputs = await MultiStoreDbAction.getInstance().getInputs(row);
    const commitments = await MultiStoreDbAction.getInstance().getCommitments(
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
      partial: partialBytes
        ? wasm.Transaction.sigma_parse_bytes(
            Buffer.from(partialBytes, encoding),
          )
        : undefined,
      dataBoxes: [],
      boxes: inputs.map((item) => deserialize(item)),
      simulated: [],
      signed: [],
      commitments: commitments.commitments,
      secrets: commitments.secrets,
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
          ...row.commitments.map(
            (commitmentRow) =>
              commitmentRow.filter((commitment) => commitment !== '').length,
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

const notAvailableAddresses = (
  wallet: StateWallet,
  commitments: Array<Array<string>>,
  tx: wasm.UnsignedTransaction,
  boxes: Array<wasm.ErgoBox>,
) => {
  const prefix = getChain(wallet.networkType).prefix;
  const boxAddresses = getTxBoxes(tx, boxes)
    .filter((_item, index) => commitments[index].some((item) => item !== ''))
    .map((item) =>
      wasm.Address.recreate_from_ergo_tree(item.ergo_tree()).to_base58(prefix),
    );
  const walletAddressSet = new Set(
    wallet.addresses.map((item) => item.address),
  );
  return boxAddresses.filter((item) => !walletAddressSet.has(item));
};

const updateMultiSigRow = async (
  rowId: number,
  commitments: Array<Array<string>>,
  secrets: Array<Array<string>>,
  signed: Array<string>,
  simulated: Array<string>,
  updateTime: number,
  partial?: wasm.Transaction,
) => {
  console.log(signed, simulated);
  const row = await MultiStoreDbAction.getInstance().getRowById(rowId);
  if (row) {
    await MultiStoreDbAction.getInstance().insertMultiSigCommitments(
      row,
      commitments,
      secrets,
    );
    if (partial) {
      await MultiStoreDbAction.getInstance().insertMultiSigTx(
        row,
        Buffer.from(partial.sigma_serialize_bytes()).toString(encoding),
        MultiSigTxType.Partial,
      );
    }
    store.dispatch(setMultiSigLoadedTime(updateTime));
  }
};

const storeMultiSigRow = async (
  wallet: StateWallet,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  commitments: Array<Array<string>>,
  secrets: Array<Array<string>>,
  signed: Array<string>,
  simulated: Array<string>,
  updateTime: number,
  partial?: wasm.Transaction,
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
      MultiSigTxType.Reduced,
    );
    await updateMultiSigRow(
      row.id,
      commitments,
      secrets,
      signed,
      simulated,
      updateTime,
      partial,
    );
  }
  return row;
};

export {
  multiSigStoreNewTx,
  fetchMultiSigRows,
  fetchMultiSigBriefRow,
  storeMultiSigRow,
  notAvailableAddresses,
  updateMultiSigRow,
};
