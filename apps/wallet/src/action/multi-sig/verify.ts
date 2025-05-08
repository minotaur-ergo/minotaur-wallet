import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import { dottedText } from '@/utils/functions';
import { secp256k1 } from '@noble/curves/secp256k1';

import * as wasm from 'ergo-lib-wasm-browser';
import { Buffer } from 'buffer';
import { MultiSigDataRow, MultiSigShareData } from '@/types/multi-sig';
import { deserialize } from '../box';
import {
  fetchMultiSigRows,
  notAvailableAddresses,
  storeMultiSigRowNew,
  updateMultiSigRowNew,
} from './store';
import { StateWallet } from '@/store/reducer/wallet';

const ECPoint = secp256k1.ProjectivePoint;

interface VerificationResponse {
  valid: boolean;
  message: string;
  txId?: string;
}

/**
 * Verifies transaction addresses with hints.
 *
 * This function validates that all addresses used in the transaction are
 * derived in signing wallet.
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
  oldCommitments: Array<Array<string>>,
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
            oldCommitments[rowIndex][itemIndex] !== item &&
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
 * This function checks the hints to ensure they are valid and that the transaction is not
 * in a signing state. Each hint must either be empty or be a valid base64 string that
 * decodes to a 32-byte array (representing a commitment). If any hint has a different format,
 * it indicates that the transaction is already being signed.
 *
 * @param hints - 2D array of hints (commitments) for each input
 * @returns A verification response indicating if the transaction is not already being signed
 */
const verifyNotSigningNewTx = (
  hints: Array<Array<string>>,
): VerificationResponse => {
  for (const hint of hints) {
    for (const element of hint) {
      // Check if the element is either empty or decodes to a 32-byte array
      if (element !== '') {
        try {
          // Decode base64 string to byte array
          const decoded = Buffer.from(element, 'base64');

          // Check if the decoded byte array has a length of 33
          if (decoded.length !== 33) {
            return {
              valid: false,
              message: 'Transaction already signing without your commitment',
            };
          }
        } catch (error) {
          // If decoding fails, the format is invalid
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
 * This function validates a transaction. It checks that the transaction inputs are valid
 * and that the transaction is not already being signed.
 *
 * @param sharedData
 * @param wallet - The multi-signature wallet
 * @param signer - The wallet that will be used for signing
 * @returns A verification response indicating if the transaction is valid
 */
const verifyNewTx = async (
  sharedData: MultiSigShareData,
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
  const notCommitted = verifyNotCommittedNewTx(sharedData.hints, pks, myPks);
  if (!notCommitted.valid) return notCommitted;

  // Verify Schnorr proofs in hints
  const verifyProofs = verifyHintsProof(sharedData.hints, pks);
  if (!verifyProofs.valid) return verifyProofs;

  return { valid: true, message: '' };
};

/**
 * Verifies an existing multi-signature transaction using the new hint format.
 *
 * This function verifies that an existing multi-signature transaction with the new hint format
 * is valid and can be signed. It checks that the transaction inputs are valid, the transaction
 * belongs to the selected row, and the hints are valid.
 *
 * @param sharedData - The multi-signature transaction data in the new format
 * @param wallet - The wallet that owns the transaction
 * @param signer - The wallet that will be used for signing
 * @param row - Optional existing row data for the transaction
 * @param txId - Optional transaction ID to verify against
 * @returns A verification response indicating if the transaction is valid
 */
const verifyExistingTx = async (
  sharedData: MultiSigShareData,
  wallet: StateWallet,
  signer: StateWallet,
  row: MultiSigDataRow,
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

  // Verify hints are not already being signed
  const notSigning = verifyNotSigningNewTx(sharedData.hints);
  if (!notSigning.valid) return notSigning;

  // Get public keys for inputs
  const unsigned = tx.unsigned_tx();
  const pks = await getInputPks(wallet, signer, unsigned, boxes);
  const myPks = await getMyInputPks(wallet, signer, unsigned, boxes);

  // Verify my commitments haven't changed
  const verifyCommitments = verifyMyCommitments(
    sharedData.hints,
    row.hints,
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
  data: MultiSigShareData,
  wallet: StateWallet,
  signer: StateWallet,
  txId?: string,
): Promise<VerificationResponse> => {
  const rows = await fetchMultiSigRows(wallet);
  console.log(signer, txId);
  const tx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(data.tx, 'base64'),
  );
  const filteredRow = rows.filter(
    (item) =>
      item.tx.unsigned_tx().id().to_str() == tx.unsigned_tx().id().to_str(),
  );
  const verification = await (txId === undefined && filteredRow.length === 0
    ? verifyNewTx(data, wallet, signer)
    : verifyExistingTx(data, wallet, signer, filteredRow[0], txId));
  if (!verification.valid) return verification;
  if (filteredRow.length > 0) {
    const row = filteredRow[0];
    await updateMultiSigRowNew(row.rowId, data.hints, row.secrets, Date.now());
  } else {
    await storeMultiSigRowNew(
      wallet,
      tx,
      data.boxes.map(deserialize),
      data.hints,
      [[]],
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
 * This function extracts components from hints longer than 32 bytes:
 * - commitment (32 bytes) + challenge (24 bytes) + proof (32 bytes) + type (1 byte)
 *
 * For verification, it uses the Schnorr equation: g^s * X^(n-e) = R
 * where g=base point, s=proof, X=public key, e=challenge, n=curve order, R=commitment
 *
 * @param hints - 2D array of base64 encoded hints to verify
 * @param publicKeys - 2D array of public keys in hex format
 * @returns Verification result with validity status and message
 */
const verifyHintsProof = (
  hints: Array<Array<string>>,
  publicKeys: Array<Array<string>>,
): VerificationResponse => {
  try {
    const invalidHints = hints.flatMap((inputHints, inputIndex) => {
      const inputPublicKeys = publicKeys[inputIndex] || [];

      return inputHints
        .filter((hint, index) => {
          if (!hint) return false;

          try {
            const decoded = Buffer.from(hint, 'base64');

            if (decoded.length <= 32) return false;

            const commitment = decoded.subarray(0, 33);

            if (decoded.length < 89) return false;

            const challengeBuffer = decoded.subarray(33, 57);
            const proofBuffer = decoded.subarray(57, 89);

            const challengeHex = '0x' + challengeBuffer.toString('hex');
            const proofHex = '0x' + proofBuffer.toString('hex');

            try {
              const challengeBigInt = BigInt(challengeHex);
              const proofBigInt = BigInt(proofHex);
              const publicKey = inputPublicKeys[index];

              if (!publicKey) return false;

              try {
                const publicKeyPoint = ECPoint.fromHex(publicKey);
                const negativeChallenge = secp256k1.CURVE.n - challengeBigInt;

                const calculatedCommitment =
                  secp256k1.ProjectivePoint.BASE.multiply(proofBigInt).add(
                    publicKeyPoint.multiply(negativeChallenge),
                  );

                const calculatedCommitmentBytes =
                  calculatedCommitment.toRawBytes();
                const isValid =
                  Buffer.compare(calculatedCommitmentBytes, commitment) === 0;

                return !isValid;
              } catch (error) {
                console.error(
                  'Error converting public key to curve point:',
                  error,
                );
                return true;
              }
            } catch (error) {
              console.error('Error converting to BigInt:', error);
              return true;
            }
          } catch (error) {
            console.error('Error processing hint:', error);
            return true;
          }
        })
        .map((_hint, index) => ({ inputIndex, index }));
    });

    if (invalidHints.length === 0) {
      return { valid: true, message: '' };
    }

    const firstInvalid = invalidHints[0];
    return {
      valid: false,
      message: `Invalid proof at input ${firstInvalid.inputIndex}, index ${firstInvalid.index}`,
    };
  } catch (error) {
    console.error('Error verifying hints proof:', error);
    return {
      valid: false,
      message: 'Error verifying hints proof',
    };
  }
};

export {
  verifyNewTx,
  verifyExistingTx,
  verifyNotSigningNewTx,
  verifyTxAddresses,
  verifyAndSaveData,
  verifyHintsProof,
};
