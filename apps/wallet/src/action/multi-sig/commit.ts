import {
  CommitResult,
  MultiSigData,
  StateWallet,
  TxHintBag,
} from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { storeMultiSigRow } from '@/action/multi-sig/store';
import { getProver } from '@/action/wallet';

/**
 * Creates or updates commitments for a multi-signature transaction.
 *
 * This function generates new commitment data based on the wallet's prover and the transaction,
 * then updates the provided hints with this new data. If any changes are detected, it stores
 * the updated data in the database.
 *
 * @param tx - The reduced transaction to generate commitments for
 * @param wallet - The wallet containing the transaction
 * @param signer - The wallet that will sign the transaction
 * @param password - The password to unlock the signer's private keys
 * @param boxes - The input boxes used in the transaction
 * @param hints - The existing multi-signature data hints to update
 * @returns A promise resolving to a CommitResult containing the updated hints and status information
 */
export const commit = async (
  tx: wasm.ReducedTransaction,
  wallet: StateWallet,
  signer: StateWallet,
  password: string,
  boxes: Array<wasm.ErgoBox>,
  hints: MultiSigData,
): Promise<CommitResult> => {
  const data = hints.map((row) => row.map((item) => item.clone()));
  const prover = await getProver(signer, password, wallet.addresses);
  const commitment = prover
    .generate_commitments_for_reduced_transaction(tx)
    .to_json() as TxHintBag;
  const changed = data.filter(
    (row) => row.filter((item) => item.fill(commitment)).length > 0,
  );
  if (changed.length > 0) {
    const currentTime = Date.now();
    const row = await storeMultiSigRow(wallet, tx, boxes, data, currentTime);
    return {
      hints: data,
      rowId: row?.id,
      changed: true,
      updateTime: currentTime,
    };
  } else {
    return {
      hints: data,
      rowId: -1,
      changed: false,
      updateTime: -1,
    };
  }
};
