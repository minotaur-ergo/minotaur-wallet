import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  MultiSigDataHint,
  MultiSigHintType,
  StateWallet,
  TxHintBag,
} from '@minotaur-ergo/types';
import { boxArrayToBoxes, fakeContext } from '@minotaur-ergo/utils';

import { storeMultiSigRow } from '@/action/multi-sig/store';
import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import { getProver } from '@/action/wallet';

/**
 * Converts an array of public key strings to a Propositions object for Ergo transactions.
 *
 * @param input - Array of public key strings in hex format
 * @returns A wasm.Propositions object containing all provided public keys
 */
const arrayToProposition = (input: Array<string>): wasm.Propositions => {
  const output = new wasm.Propositions();
  input.forEach((pk) => {
    const proposition = Uint8Array.from(Buffer.from('cd' + pk, 'hex'));
    output.add_proposition_from_byte(proposition);
  });
  return output;
};

/**
 * Generates transaction hints (both secret and public) from multi-signature data hints.
 *
 * This function processes arrays of hints and converts them to the format required
 * by the Ergo wasm library for multi-signature transaction signing.
 *
 * @param hints - 2D array of MultiSigDataHint objects organized by input and signer
 * @param inputPks - 2D array of public keys corresponding to each input and signer
 * @param password - Optional password for generating secure hints
 * @returns A wasm.TransactionHintsBag object containing all hints
 */
const generateHints = (
  hints: Array<Array<MultiSigDataHint>>,
  inputPks: Array<Array<string>>,
  password?: string,
) => {
  const hintJson: TxHintBag = { secretHints: {}, publicHints: {} };
  hints.forEach((hintRow, inputIndex) => {
    hintJson.secretHints[`${inputIndex}`] = hintRow
      .map((hint) => {
        return hint.generateSecretHint(inputPks);
      })
      .flat();
    hintJson.publicHints[`${inputIndex}`] = hintRow
      .map((hint) => {
        return hint.generatePublicHint(inputPks, password);
      })
      .flat();
  });
  return wasm.TransactionHintsBag.from_json(JSON.stringify(hintJson));
};

/**
 * Signs a reduced transaction using a multi-signature wallet and updates hint data.
 *
 * This function performs partial signing of a transaction based on the provided hints and
 * wallet credentials. It extracts new hint data from the partial signature and updates
 * the hint objects. Finally, it stores the updated multi-signature data in the database.
 *
 * @param wallet - The multi-signature wallet that owns the transaction
 * @param signer - The wallet that will perform the signing
 * @param hints - Array of multi-signature data hints to use and update
 * @param tx - The reduced transaction to sign
 * @param boxes - Array of input boxes used in the transaction
 * @param password - Password to unlock the signer's private keys
 * @returns A promise resolving to an object containing updated hints and timestamp
 */
export const sign = async (
  wallet: StateWallet,
  signer: StateWallet,
  hints: Array<Array<MultiSigDataHint>>,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  password: string,
): Promise<{
  hints: Array<Array<MultiSigDataHint>>;
  currentTime: number;
}> => {
  const unsigned = tx.unsigned_tx();
  const inputPks = await getInputPks(wallet, signer, unsigned, boxes);
  const txHintBag = generateHints(hints, inputPks, password);
  const prover = await getProver(signer, password, wallet.addresses);
  const partialSigned = prover.sign_reduced_transaction_multi(tx, txHintBag);
  const signedPks = await getMyInputPks(wallet, signer, unsigned, boxes);
  const simulatedPks: Array<string> = hints
    .map((hintRow, inputIndex) => {
      return hintRow.map((hint, signerIndex) => {
        if (hint.Commit === '' || hint.Type === MultiSigHintType.Simulated)
          return inputPks[inputIndex][signerIndex];
        return '';
      });
    })
    .flat()
    .filter((item) => item !== '');
  const newHintBag = wasm
    .extract_hints(
      partialSigned,
      fakeContext(),
      boxArrayToBoxes(boxes),
      wasm.ErgoBoxes.empty(),
      arrayToProposition(signedPks),
      arrayToProposition(simulatedPks),
    )
    .to_json() as TxHintBag;
  let changed = false;
  const updatedHints = hints.map((hintRow) => {
    return hintRow.map((hint) => {
      const res = hint.clone();
      changed = res.fill(newHintBag) || changed;
      return res;
    });
  });
  if (changed) {
    const currentTime = Date.now();
    await storeMultiSigRow(wallet, tx, boxes, updatedHints, currentTime);
    return {
      hints: updatedHints,
      currentTime,
    };
  }
  return {
    hints: updatedHints,
    currentTime: -1,
  };
};

/**
 * Creates a fully signed transaction from a multi-signature transaction with complete hints.
 *
 * This function is intended for the final signing step when all necessary signatures
 * have been collected in the hints. It uses an empty wallet to create the final
 * transaction without adding any new signatures.
 *
 * Note: This function contains debug logging and is primarily used for testing or
 * development purposes.
 *
 * @param wallet - The multi-signature wallet that owns the transaction
 * @param signer - The wallet providing context for signature verification
 * @param hints - Array of multi-signature data hints containing all required signatures
 * @param tx - The reduced transaction to finalize
 * @param boxes - Array of input boxes used in the transaction
 * @returns A promise resolving to the fully signed transaction
 */
export const signCompleted = async (
  wallet: StateWallet,
  signer: StateWallet,
  hints: Array<Array<MultiSigDataHint>>,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
) => {
  const unsigned = tx.unsigned_tx();
  const inputPks = await getInputPks(wallet, signer, unsigned, boxes);
  const txHintBag = generateHints(hints, inputPks);
  const prover = wasm.Wallet.from_secrets(new wasm.SecretKeys());
  return prover.sign_reduced_transaction_multi(tx, txHintBag);
};
