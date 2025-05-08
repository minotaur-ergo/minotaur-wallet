import { encrypt } from '@/utils/enc';
import { Buffer } from 'buffer';
import * as wasm from 'ergo-lib-wasm-browser';
import {
  DetachedCommitments,
  MultiSigHint,
  MultiSigHintType,
  TxHintBag,
} from '@/types/multi-sig';

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
  const commitmentJson: TxHintBag = commitment.to_json();
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
      return rowCommitment.map((item) =>
        item.length === 0 ? '' : encrypt(item, password),
      );
    }
    secretHints.map((item) => {
      const pubIndex = rowPublicKeys.indexOf(item.pubkey.h);
      if (pubIndex >= 0) {
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
            // Compare the first 33 bytes
            const baseFirst33 = baseDecoded.subarray(0, 33);
            if (Buffer.compare(baseFirst33, overrideDecoded) === 0) {
              // First 33 bytes match, keep the base hint
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

/**
 * Converts a MultiSigHint object to a base64 encoded string representation for sharing.
 *
 * This function takes a MultiSigHint object and converts it to a base64 encoded string
 * that represents a byte array with the following structure:
 * - First 33 bytes: commitment data
 * - Next 56 bytes (if proof exists): proof data
 * - Last byte (if proof exists): type indicator (0 for REAL, 1 for SIMULATED)
 *
 * If the hint does not have a proof, only the 33-byte commitment is included in the output.
 * The function uses Buffer.concat to efficiently combine the different parts of the hint.
 *
 * @param hint - The MultiSigHint object to convert
 * @returns A base64 encoded string representation of the hint, or an empty string if the hint is invalid
 */
const HintsToShare = (hint: MultiSigHint): string => {
  // If the hint is empty or has no commit, return an empty string
  if (!hint || !hint.commit) {
    return '';
  }

  // If there's no proof, just return the commit
  if (!hint.proof) {
    return hint.commit;
  }
  const hintType = Buffer.from([
    hint.type === MultiSigHintType.SIMULATED ? 1 : 0,
  ]);
  return Buffer.concat([
    Buffer.from(hint.commit, 'base64'),
    Buffer.from(hint.proof, 'base64'),
    hintType,
  ]).toString('base64');
};

/**
 * Converts a base64 encoded string representation back to a MultiSigHint object.
 *
 * This function takes a base64 encoded string that was created by HintsToShare
 * and converts it back to a MultiSigHint object. The input string is expected to
 * have the following structure when decoded:
 * - First 33 bytes: commitment data
 * - Next 56 bytes (if present): proof data
 * - Last byte (if proof exists): type indicator (0 for REAL, 1 for SIMULATED)
 *
 * If the input string only contains commitment data (33 bytes), the resulting
 * MultiSigHint will have no proof and the type will default to SIGNED.
 *
 * @param base64String - The base64 encoded string to convert
 * @returns A MultiSigHint object, or a default object with empty commit if the input is invalid
 */
const ShareToHint = (base64String: string): MultiSigHint => {
  // If the input is empty, return a default hint
  if (!base64String) {
    return { commit: '', proof: '', type: MultiSigHintType.REAL };
  }

  try {
    // Decode the base64 string to a buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Extract the commitment (first 33 bytes)
    const commit = buffer.subarray(0, 33).toString('base64');

    // If the buffer only contains the commitment, return a hint with just the commit
    if (buffer.length <= 33) {
      return { commit, proof: '', type: MultiSigHintType.REAL };
    }

    // Extract the proof (next 56 bytes)
    const proof = buffer.subarray(33, 89).toString('base64');

    // Extract the type (last byte, if present)
    const type =
      buffer.length > 89 && buffer[89] === 1
        ? MultiSigHintType.SIMULATED
        : MultiSigHintType.REAL;

    return { commit, proof, type };
  } catch (error) {
    console.error('Error converting base64 string to MultiSigHint:', error);
    // In case of error, return a default hint
    return { commit: '', proof: '', type: MultiSigHintType.REAL };
  }
};

export {
  extractCommitments,
  HintsToByte,
  detachCommitments,
  overrideHints,
  HintsToShare,
  ShareToHint,
};
