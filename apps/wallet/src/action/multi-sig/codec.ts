import { encrypt } from '@/utils/enc';
import { Buffer } from 'buffer';
import * as wasm from 'ergo-lib-wasm-browser';
import { DetachedCommitments, TransactionHintBagType } from '@/types/multi-sig';

/**
 * Extracts public and private commitments from a transaction hints bag.
 *
 * This function separates the commitments in a transaction hints bag into two categories:
 * - public commitments: the first commitment for each input (index 0)
 * - private commitments: the second commitment for each input (index 1)
 *
 * The function creates two new transaction hints bags, one for public commitments
 * and one for private commitments, and returns them as an object.
 *
 * @param commitment - The transaction hints bag containing all commitments
 * @param inputLength - The number of inputs in the transaction
 * @returns An object with public and private transaction hints bags
 */
const extractCommitments = (
  commitment: wasm.TransactionHintsBag,
  inputLength: number,
) => {
  const tx_known = wasm.TransactionHintsBag.empty();
  const tx_own = wasm.TransactionHintsBag.empty();
  for (let index = 0; index < inputLength; index++) {
    const input_commitments = commitment.all_hints_for_input(index);
    const input_known = wasm.HintsBag.empty();
    if (input_commitments.len() > 0) {
      input_known.add_commitment(input_commitments.get(0));
      tx_known.add_hints_for_input(index, input_known);
    }
    const input_own = wasm.HintsBag.empty();
    if (input_commitments.len() > 1) {
      input_own.add_commitment(input_commitments.get(1));
      tx_own.add_hints_for_input(index, input_own);
    }
  }
  return {
    public: tx_known,
    private: tx_own,
  };
};

/**
 * Converts a transaction hints bag to a 2D array of base64 encoded strings.
 *
 * This function takes a transaction hints bag and converts it to a 2D array of
 * base64 encoded strings that can be stored or transmitted. The function handles
 * both public and secret hints differently:
 *
 * - For public hints (without password):
 *   - Extracts the commitment (a) from each hint
 *   - If secret hints exist, appends the proof and type byte to the commitment
 *   - Converts the resulting buffer to a base64 string
 *
 * - For secret hints (with password):
 *   - Extracts the secret from each hint
 *   - Encrypts the secret with the provided password
 *   - Returns the encrypted secrets
 *
 * @param commitment - The transaction hints bag to convert
 * @param inputPublicKeys - 2D array of public keys for each input
 * @param password - Optional password to encrypt secrets
 * @returns A 2D array of base64 encoded strings representing the hints
 */
const HintsToByte = (
  commitment: wasm.TransactionHintsBag,
  inputPublicKeys: Array<Array<string>>,
  password?: string,
): Array<Array<string>> => {
  const commitmentJson: TransactionHintBagType = commitment.to_json();
  return inputPublicKeys.map((rowPublicKeys, index) => {
    const publicHints = commitmentJson.publicHints[`${index}`] || [];
    const secretHints = commitmentJson.secretHints[`${index}`] || [];
    const rowCommitment = rowPublicKeys.map(() => Buffer.from([]));
    publicHints.forEach((item) => {
      const pubIndex = rowPublicKeys.indexOf(item.pubkey.h);
      if (pubIndex >= 0) {
        if (password) {
          if (item.secret) {
            rowCommitment[pubIndex] = Buffer.from(item.secret, 'hex');
          }
        } else {
          rowCommitment[pubIndex] = Buffer.from(item.a, 'hex');
        }
      }
    });
    if (password) {
      return rowCommitment.map((item) => encrypt(item, password));
    }
    secretHints.map((item) => {
      const pubIndex = rowPublicKeys.indexOf(item.pubkey.h);
      if (pubIndex) {
        const proof = Buffer.from(item.proof, 'hex');
        const type = Buffer.from([item.hint === 'proofReal' ? 0 : 1]);
        rowCommitment[pubIndex] = Buffer.concat([
          rowCommitment[pubIndex],
          proof,
          type,
        ]);
      }
    });
    return rowCommitment.map((item) => item.toString('base64'));
  });
};

/**
 * Detaches commitments from a transaction hints bag into separate public and private bags.
 *
 * This function separates the commitments in a transaction hints bag into two separate bags:
 * - known (public): contains the first commitment for each input (index 0)
 * - own (private): contains the second commitment for each input (index 1)
 *
 * This separation is useful for handling public and private commitments differently,
 * such as sharing only the public commitments with other signers while keeping the
 * private commitments secure.
 *
 * @param commitment - The transaction hints bag containing all commitments
 * @param inputLength - The number of inputs in the transaction
 * @returns An object with 'known' (public) and 'own' (private) transaction hints bags
 */
const detachCommitments = (
  commitment: wasm.TransactionHintsBag,
  inputLength: number,
): DetachedCommitments => {
  const known = wasm.TransactionHintsBag.empty();
  const own = wasm.TransactionHintsBag.empty();
  for (let index = 0; index < inputLength; index++) {
    const input_commitments = commitment.all_hints_for_input(index);
    const input_known = wasm.HintsBag.empty();
    if (input_commitments.len() > 0) {
      input_known.add_commitment(input_commitments.get(0));
      known.add_hints_for_input(index, input_known);
    }
    const input_own = wasm.HintsBag.empty();
    if (input_commitments.len() > 1) {
      input_own.add_commitment(input_commitments.get(1));
      own.add_hints_for_input(index, input_own);
    }
  }
  return { own, known };
};

/**
 * Overrides base hints with new hints where available.
 *
 * This function takes two 2D arrays of hints and creates a new array by
 * overriding the base hints with the override hints where they are not empty.
 * It also tracks whether any changes were made during the override process.
 *
 * If the arrays have different lengths, the override hints are used as is.
 * Otherwise, for each position, the following rules apply:
 *
 * - If the override hint is empty, the base hint is kept
 * - If the hints are identical, no change is made
 * - If base contains proof and override does not contain proof, we do not override it
 * - In all other cases, if the override hint is not empty and different from the
 *   base hint, it replaces the base hint
 *
 * @param baseHints - The original 2D array of hints to be overridden
 * @param overrideHints - The 2D array of hints to override with
 * @returns An object containing the merged hints and a boolean indicating if changes were made
 */
const overrideHints = (
  baseHints: Array<Array<string>>,
  overrideHints: Array<Array<string>>,
): { hints: Array<Array<string>>; changed: boolean } => {
  if (baseHints.length !== overrideHints.length) {
    return { hints: [...overrideHints], changed: true };
  }
  let changed = false;
  const hints = baseHints.map((inputHints, index) => {
    const overrideHintRow = overrideHints[index];
    return inputHints.map((hint, index) => {
      // If override hint is empty, keep the base hint
      if (overrideHintRow[index] === '') {
        return hint;
      }

      // If hints are already the same, no change needed
      if (overrideHintRow[index] === hint) {
        return hint;
      }

      // Special case: if base contain proof and override does not contain proof we do not override it
      try {
        // Only proceed with this check if both hints are not empty
        if (hint && overrideHintRow[index]) {
          const baseDecoded = Buffer.from(hint, 'base64');
          const overrideDecoded = Buffer.from(overrideHintRow[index], 'base64');

          // If override is exactly 32 bytes and base is longer
          if (overrideDecoded.length === 32 && baseDecoded.length > 32) {
            // Compare the first 32 bytes
            const baseFirst32 = baseDecoded.slice(0, 32);
            if (Buffer.compare(baseFirst32, overrideDecoded) === 0) {
              // First 32 bytes match, keep the base hint
              return hint;
            }
          }
        }
      } catch (error) {
        // If there's an error in decoding, fall back to simple comparison
        console.error('Error comparing hints:', error);
      }

      // In all other cases, use the override hint and mark as changed
      changed = true;
      return overrideHintRow[index];
    });
  });
  return { hints, changed };
};

export { extractCommitments, HintsToByte, detachCommitments, overrideHints };
