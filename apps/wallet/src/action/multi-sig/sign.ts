import {
  detachCommitments,
  HintsToByte,
  overrideHints,
} from '@/action/multi-sig/codec';
import { arrayToProposition, toHintBag } from '@/action/multi-sig/signing';
import { storeMultiSigRowNew } from '@/action/multi-sig/store';
import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import { getProver } from '@/action/wallet';
import { StateWallet } from '@/store/reducer/wallet';
import { CommitResult, MultiSigSimpleData } from '@/types/multi-sig';
import getChain from '@/utils/networks';
import * as wasm from 'ergo-lib-wasm-browser';

/**
 * Generates commitments for a reduced transaction.
 *
 * This function uses the wallet to generate commitments for a reduced transaction
 * and then detaches these commitments into separate public and private bags.
 *
 * @param wallet - The wallet to generate commitments with
 * @param tx - The reduced transaction to generate commitments for
 * @returns An object containing detached public and private commitment bags
 */
const generateCommitments = (
  wallet: wasm.Wallet,
  tx: wasm.ReducedTransaction,
) => {
  const commitment = wallet.generate_commitments_for_reduced_transaction(tx);
  return detachCommitments(commitment, tx.unsigned_tx().inputs().len());
};

/**
 * Commits to a multi-signature transaction.
 *
 * This function generates commitments for a transaction using the signer's wallet,
 * converts these commitments to base64 encoded strings, and merges them with any
 * existing commitments. If changes are made, the updated data is stored in the database.
 *
 * The function handles both public commitments (hints) and private commitments (secrets):
 * - Public commitments are shared with other signers
 * - Private commitments are encrypted with the password and stored locally
 *
 * @param tx - The reduced transaction to commit to
 * @param wallet - The wallet that owns the transaction
 * @param signer - The wallet that will be used for signing
 * @param password - The password to encrypt private commitments
 * @param boxes - The boxes used as inputs in the transaction
 * @param data - The existing transaction data with hints and secrets
 * @returns An object containing the updated hints, secrets, and other metadata
 */
export const commit = async (
  tx: wasm.ReducedTransaction,
  wallet: StateWallet,
  signer: StateWallet,
  password: string,
  boxes: Array<wasm.ErgoBox>,
  data: MultiSigSimpleData,
): Promise<CommitResult> => {
  const prover = await getProver(signer, password, wallet.addresses);
  const detached = generateCommitments(prover, tx);
  const unsigned = tx.unsigned_tx();
  const inputPks = await getInputPks(wallet, signer, unsigned, boxes);
  const known = HintsToByte(detached.known, inputPks);
  const own = HintsToByte(detached.own, inputPks, password);

  const newHints = overrideHints(data.hints, known);
  const newOwnHints = overrideHints(data.secrets, own);
  if (newHints.changed || newOwnHints.changed) {
    const currentTime = Date.now();
    const row = await storeMultiSigRowNew(
      wallet,
      tx,
      boxes,
      newHints.hints,
      newOwnHints.hints,
      currentTime,
    );
    return {
      hints: newHints.hints,
      secrets: newOwnHints.hints,
      updateTime: currentTime,
      rowId: row?.id,
      changed: true,
    };
  }
  return {
    hints: data.hints,
    secrets: data.secrets,
    updateTime: -1,
    rowId: -1,
    changed: false,
  };
};

/**
 * Signs a multi-signature transaction using the new hint format and extracts new hints.
 *
 * This function signs a multi-signature transaction using the new hint format and then
 * extracts the hints from the signed transaction. These hints can be shared with other
 * signers to complete the multi-signature process.
 *
 * The function works by:
 * 1. Converting the hints and secrets to a hint bag using toHintBag
 * 2. Using the prover to sign the reduced transaction
 * 3. Extracting hints from the signed transaction
 * 4. Converting the extracted hints to base64 encoded strings
 * 5. Merging the new hints with the existing hints
 * 6. Storing the updated hints in the database if changes were made
 *
 * @param wallet - The wallet that owns the transaction
 * @param signer - The wallet that will be used for signing
 * @param hints - 2D array of hints in the new format
 * @param secrets - 2D array of secrets corresponding to the hints
 * @param tx - The reduced transaction to sign
 * @param boxes - The boxes used as inputs in the transaction
 * @param password - The password to unlock the signer's wallet
 * @returns A promise that resolves to an object containing the updated hints and timestamp
 */
export const signPartial = async (
  wallet: StateWallet,
  signer: StateWallet,
  hints: Array<Array<string>>,
  secrets: Array<Array<string>>,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  password: string,
): Promise<{ currentTime: number; hints: Array<Array<string>> }> => {
  const unsigned = tx.unsigned_tx();
  const publicKeys = await getInputPks(wallet, signer, unsigned, boxes);
  const myPublicKeys = await getMyInputPks(wallet, signer, unsigned, boxes);
  const txHintBag = toHintBag(publicKeys, hints, secrets, password, false);
  const prover = await getProver(signer, password, wallet.addresses);
  const context = getChain(wallet.networkType).fakeContext();
  const partial = prover.sign_reduced_transaction_multi(tx, txHintBag);
  const ergoBoxes = wasm.ErgoBoxes.empty();
  boxes.forEach((box) => ergoBoxes.add(box));
  const realPropositions = arrayToProposition(myPublicKeys);
  const simulatedPropositions = arrayToProposition(myPublicKeys);
  const extracted = wasm.extract_hints(
    partial,
    context,
    ergoBoxes,
    // TODO handle data inputs
    wasm.ErgoBoxes.empty(),
    realPropositions,
    simulatedPropositions,
  );
  const newHints = HintsToByte(extracted, publicKeys);
  const finalHints = overrideHints(hints, newHints);
  if (finalHints.changed) {
    const currentTime = Date.now();
    await storeMultiSigRowNew(
      wallet,
      tx,
      boxes,
      finalHints.hints,
      secrets,
      currentTime,
    );
    return { hints: finalHints.hints, currentTime };
  }
  return {
    hints: finalHints.hints,
    currentTime: -1,
  };
};
