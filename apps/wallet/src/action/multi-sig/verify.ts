import {
  MultiSigDataHint,
  MultiSigDataHintType,
  MultiSigDataShare,
  StateWallet,
} from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { MultiSigDataHintImpl } from '@/action/multi-sig/codec';
import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import { dottedText } from '@/utils/functions';
import getChain from '@/utils/networks';

import { deserialize } from '../box';
import { getTxBoxes } from '../tx';
import {
  fetchMultiSigRows,
  storeMultiSigRow,
  updateMultiSigRow,
} from './store';

interface VerificationResponse {
  valid: boolean;
  message: string;
  txId?: string;
}

/**
 * Verifies transaction addresses with hints.
 *
 * This function validates that all addresses used in the transaction are
 * derived in the signing wallet. If any address is not found, the transaction
 * cannot be signed.
 *
 * @param tx - The reduced transaction to verify
 * @param hints - 2D array of hints (commitments) for each input
 * @param boxes - Array of ErgoBoxes used as inputs in the transaction
 * @param wallet - The wallet that will be used for signing
 * @returns A verification response indicating if the addresses are valid
 */
const verifyTxAddresses = (
  tx: wasm.ReducedTransaction,
  hints: Array<Array<string>>,
  boxes: Array<wasm.ErgoBox>,
  wallet: StateWallet,
): VerificationResponse => {
  // verify addresses
  const invalidAddresses = notAvailableAddresses(
    wallet,
    hints,
    tx.unsigned_tx(),
    boxes,
  );
  if (invalidAddresses.length > 0) {
    const messageLines = [
      'Some addresses used in transaction are not derived.',
      'Please derive them and try again',
      'Not derived addresses are:',
      ...invalidAddresses.map((item) => dottedText(item, 10)),
    ];
    return { valid: false, message: messageLines.join('\n') };
  }
  return { valid: true, message: '' };
};

/**
 * Verifies that the user's commitments have not changed.
 *
 * This function checks if any of the user's commitments in the transaction
 * have been modified. If a commitment has changed, the transaction cannot
 * be signed anymore and must be restarted from the beginning.
 *
 * @param commitments - The current commitments in the transaction
 * @param oldCommitments - The previous commitments that were stored
 * @param pks - Array of public keys for each input
 * @param myPks - Array of the user's public keys
 * @returns A verification response indicating if commitments are valid
 */
const verifyMyCommitments = (
  commitments: Array<Array<string>>,
  oldCommitments: Array<Array<MultiSigDataHint>>,
  pks: Array<Array<string>>,
  myPks: Array<string>,
): VerificationResponse => {
  const filteredMyPks = pks.map((row) =>
    row.map((item) => (myPks.indexOf(item) === -1 ? '' : item)),
  );
  const valid =
    commitments.filter((row, rowIndex) => {
      return (
        row.filter((item, itemIndex) => {
          if (
            !MultiSigDataHintImpl.deserialize(item, rowIndex, itemIndex).equals(
              oldCommitments[rowIndex][itemIndex],
            ) &&
            filteredMyPks[rowIndex][itemIndex] !== ''
          ) {
            return true;
          }
        }).length > 0
      );
    }).length === 0;
  return {
    valid,
    message: valid
      ? ''
      : 'Your commitment changed.\nThis transaction can not sign anymore.\nPlease try sign it again from beginning',
  };
};

/**
 * Verifies that the user's wallet has not committed to a new transaction.
 *
 * This function checks if any of the user's public keys have already committed
 * to the transaction. If a commitment is found, the transaction cannot be
 * committed to again by the same wallet.
 *
 * @param commitments - The commitments in the transaction
 * @param pks - Array of public keys for each input
 * @param myPks - Array of the user's public keys
 * @returns A verification response indicating if the wallet can commit to the transaction
 */
const verifyNotCommittedNewTx = (
  commitments: Array<Array<string>>,
  pks: Array<Array<string>>,
  myPks: Array<string>,
): VerificationResponse => {
  const filteredRows = commitments.filter((commitmentRow, index) => {
    const myIndexes = myPks
      .map((item) => pks[index].indexOf(item))
      .filter((item) => item >= 0);
    return myIndexes.filter((index) => commitmentRow[index] !== '').length > 0;
  });
  return filteredRows.length > 0
    ? { valid: false, message: 'Already have my commitment' }
    : { valid: true, message: '' };
};

/**
 * Verifies that all inputs of the transaction exist in the provided list of boxes.
 *
 * This function ensures that every input referenced in the transaction corresponds
 * to a box in the provided list. If any input is missing, the transaction is invalid.
 *
 * @param tx - The reduced transaction to verify
 * @param boxes - Array of ErgoBoxes that should contain all inputs
 * @returns A verification response indicating if all inputs exist in the provided boxes
 */
const verifyTxInputs = (
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
): VerificationResponse => {
  const inputs = tx.unsigned_tx().inputs();
  for (let index = 0; index < inputs.len(); index++) {
    const input = inputs.get(index);
    if (
      boxes.filter((item) => item.box_id().to_str() === input.box_id().to_str())
        .length !== 1
    ) {
      return { valid: false, message: 'Transaction inputs are invalid' };
    }
  }
  return { valid: true, message: '' };
};

/**
 * Verifies that the transaction is not already being signed without the user's commitment.
 *
 * This function examines the hints to ensure the transaction is not in a signing state.
 * Each hint must either be empty or contain only a commitment without a proof.
 * If any hint contains a proof, it indicates that the transaction is already
 * in the process of being signed by other participants.
 *
 * Uses MultiSigDataHint.deserialize and hasProof to check if any hint contains proof.
 *
 * @param hints - 2D array of hints (commitments) for each input
 * @returns A verification response indicating if the transaction is not already being signed
 */
const verifyNotSigningNewTx = (
  hints: Array<Array<string>>,
): VerificationResponse => {
  for (const [inputIndex, hintRow] of hints.entries()) {
    for (const [signerIndex, element] of hintRow.entries()) {
      // Check if the element is either empty or does not contain a proof
      if (element !== '') {
        try {
          if (
            MultiSigDataHintImpl.deserialize(
              element,
              inputIndex,
              signerIndex,
            ).hasProof()
          ) {
            return {
              valid: false,
              message: 'Transaction already signing without your commitment',
            };
          }
        } catch (error) {
          // If deserialization fails, the format is invalid
          return {
            valid: false,
            message: 'Invalid hint format: not a valid base64 string',
          };
        }
      }
    }
  }
  return { valid: true, message: '' };
};

/**
 * Verifies a new transaction using the new simple data format.
 *
 * This function performs sequential validation of a new multi-signature transaction:
 * 1. Validates that all transaction addresses are derived in the wallet
 * 2. Ensures the transaction is not already in the signing process
 * 3. Verifies all transaction inputs exist in the provided boxes
 * 4. Finally checks that the wallet has not already committed to this transaction
 *    and returns this result
 *
 * @param sharedData - The multi-signature transaction data in the new format
 * @param wallet - The multi-signature wallet containing the addresses
 * @param signer - The wallet that will be used for signing
 * @returns A verification response indicating if the transaction is valid
 */
const verifyNewTx = async (
  sharedData: MultiSigDataShare,
  wallet: StateWallet,
  signer: StateWallet,
): Promise<VerificationResponse> => {
  const tx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(sharedData.tx, 'base64'),
  );
  const boxes = sharedData.boxes.map(deserialize);
  const verifyAddress = verifyTxAddresses(tx, sharedData.hints, boxes, wallet);
  if (!verifyAddress.valid) return verifyAddress;

  const notSigning = verifyNotSigningNewTx(sharedData.hints);
  if (!notSigning.valid) return notSigning;
  const txInputsValid = verifyTxInputs(tx, boxes);
  if (!txInputsValid.valid) return txInputsValid;

  // Verify transaction is not already being signed

  // Get public keys for inputs
  const unsigned = tx.unsigned_tx();
  const pks = await getInputPks(wallet, signer, unsigned, boxes);
  const myPks = await getMyInputPks(wallet, signer, unsigned, boxes);

  // Verify wallet has not already committed
  return verifyNotCommittedNewTx(sharedData.hints, pks, myPks);
};

/**
 * Verifies an existing multi-signature transaction using the new hint format.
 *
 * This function performs a series of validations on an existing multi-signature transaction:
 * 1. Confirms the transaction ID matches the expected ID (if provided)
 * 2. Verifies all transaction inputs exist in the provided boxes
 * 3. Validates that all transaction addresses are derived in the wallet
 * 4. Ensures the transaction is not already in the signing process
 * 5. Verifies the user's commitments haven't been modified since the last update
 * 6. Validates all Schnorr proofs in the hints against their public keys
 *
 * @param sharedData - The multi-signature transaction data in the new format
 * @param wallet - The wallet that owns the transaction
 * @param signer - The wallet that will be used for signing
 * @param hints - Array of previously stored hints for the transaction
 * @param txId - Optional transaction ID to verify against
 * @returns A verification response indicating if the transaction is valid
 */
const verifyExistingTx = async (
  sharedData: MultiSigDataShare,
  wallet: StateWallet,
  signer: StateWallet,
  hints: Array<Array<MultiSigDataHint>>,
  txId?: string,
): Promise<VerificationResponse> => {
  const tx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(sharedData.tx, 'base64'),
  );
  if (txId && tx.unsigned_tx().id().to_str() !== txId) {
    return {
      valid: false,
      message: 'This tx does not belong to selected transaction',
    };
  }

  const boxes = sharedData.boxes.map(deserialize);
  const verifyInputs = verifyTxInputs(tx, boxes);
  if (!verifyInputs.valid) return verifyInputs;

  // Verify transaction addresses
  const verifyAddress = verifyTxAddresses(tx, sharedData.hints, boxes, wallet);
  if (!verifyAddress.valid) return verifyAddress;

  // Get public keys for inputs
  const unsigned = tx.unsigned_tx();
  const pks = await getInputPks(wallet, signer, unsigned, boxes);
  const myPks = await getMyInputPks(wallet, signer, unsigned, boxes);

  // Verify my commitments haven't changed
  const verifyCommitments = verifyMyCommitments(
    sharedData.hints,
    hints,
    pks,
    myPks,
  );
  if (!verifyCommitments.valid) return verifyCommitments;

  // Verify Schnorr proofs in hints
  return verifyHintsProof(sharedData.hints, pks);
};

/**
 * Verifies and saves multi-signature transaction data using the legacy format.
 *
 * This function verifies a multi-signature transaction using the legacy format and
 * saves it to the database if it's valid. It handles both new transactions and updates
 * to existing transactions. The function is kept for backward compatibility but its
 * usage has been removed from the application.
 *
 * @param data - The multi-signature transaction data in the legacy format
 * @param wallet - The wallet that owns the transaction
 * @param signer - The wallet that will be used for signing
 * @param txId - Optional transaction ID to verify against
 * @returns A verification response indicating if the transaction is valid and saved
 */
const verifyAndSaveData = async (
  data: MultiSigDataShare,
  wallet: StateWallet,
  signer: StateWallet,
  txId?: string,
): Promise<VerificationResponse> => {
  const rows = await fetchMultiSigRows(wallet);
  const tx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(data.tx, 'base64'),
  );
  const filteredRow = rows.filter(
    (item) =>
      item.tx.unsigned_tx().id().to_str() == tx.unsigned_tx().id().to_str(),
  );
  const verification = await (txId === undefined && filteredRow.length === 0
    ? verifyNewTx(data, wallet, signer)
    : verifyExistingTx(data, wallet, signer, filteredRow[0].hints, txId));
  if (!verification.valid) return verification;
  if (filteredRow.length > 0) {
    const row = filteredRow[0];
    const newHints = filteredRow[0].hints.map((row) =>
      row.map((item) => item.clone()),
    );
    newHints.forEach((row, inputIndex) =>
      row.forEach((item, signerIndex) =>
        item.override(
          MultiSigDataHintImpl.deserialize(
            data.hints[inputIndex][signerIndex],
            inputIndex,
            signerIndex,
          ),
        ),
      ),
    );
    await updateMultiSigRow(row.rowId, newHints, Date.now());
  } else {
    await storeMultiSigRow(
      wallet,
      tx,
      data.boxes.map(deserialize),
      data.hints.map((row, inputIndex) =>
        row.map((item, signerIndex) =>
          MultiSigDataHintImpl.deserialize(item, inputIndex, signerIndex),
        ),
      ),
      Date.now(),
    );
  }
  return {
    valid: true,
    message: 'Updated Successfully',
    txId: tx.unsigned_tx().id().to_str(),
  };
};

/**
 * Verifies Schnorr proofs in hints against their commitments using public keys.
 *
 * This function uses the MultiSigDataHint.verify method to validate each hint against its
 * corresponding public key. The validation is based on the Schnorr signature scheme.
 *
 * @param hints - 2D array of base64 encoded hints to verify
 * @param publicKeys - 2D array of public keys in hex format
 * @returns Verification result with validity status and message
 */
const verifyHintsProof = (
  hints: Array<Array<string>>,
  publicKeys: Array<Array<string>>,
): VerificationResponse => {
  const invalidHints = hints.flatMap((inputHints, inputIndex) => {
    const inputPublicKeys = publicKeys[inputIndex] || [];

    return inputHints
      .filter((hint, index) => {
        if (!hint) return false;
        try {
          const hintObject = MultiSigDataHintImpl.deserialize(
            hint,
            inputIndex,
            index,
          );

          // If there's no proof or it's simulated, we don't need to verify it
          if (
            !hintObject.hasProof() ||
            hintObject.Type === MultiSigDataHintType.SIMULATED
          ) {
            return false;
          }

          // If we don't have the corresponding public key, we can't verify
          if (!inputPublicKeys[index]) {
            console.warn(
              `No public key found for hint at input ${inputIndex}, index ${index}`,
            );
            return false;
          }

          // Verify the hint against the public key using the new verify method
          return !hintObject.verify(inputPublicKeys[index]);
        } catch (error) {
          console.error(
            `Error verifying hint at input ${inputIndex}, index ${index}:`,
            error,
          );
          return true; // If there's an error, consider it invalid
        }
      })
      .map((_, index) => {
        return {
          input: inputIndex,
          index,
        };
      });
  });

  return invalidHints.length === 0
    ? { valid: true, message: '' }
    : {
        valid: false,
        message: `Invalid proof for hints: ${invalidHints
          .map((hint) => `input ${hint.input}, index ${hint.index}`)
          .join(', ')}`,
      };
};

/**
 * Identifies addresses used in transaction that are not available in the wallet.
 *
 * This function compares the addresses of the inputs that have commitments
 * against the addresses available in the wallet. It returns addresses that
 * are committed to but not present in the wallet, indicating potential issues
 * with the multi-signature coordination.
 *
 * @param wallet - The wallet state containing available addresses
 * @param commitments - 2D array of commitments for each input
 * @param tx - The unsigned transaction to check
 * @param boxes - Array of ErgoBoxes used in the transaction
 * @returns Array of addresses that are committed but not available in the wallet
 */
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

export {
  verifyAndSaveData,
  verifyExistingTx,
  verifyNewTx,
  verifyHintsProof,
  notAvailableAddresses,
};
