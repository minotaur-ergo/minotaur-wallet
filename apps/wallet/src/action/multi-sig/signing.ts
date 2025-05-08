import * as wasm from 'ergo-lib-wasm-browser';
import {
  TxSinglePublicHint,
  TxSingleSecretHint,
  TxHintBag,
  TxPublicHint,
  TxSecretHint,
  MultiSigHint,
} from '@/types/multi-sig';
import { decrypt } from '@/utils/enc';

const generateSecretHintBagJson = (
  publicKey: string,
  hint: string,
  index: number,
): TxSingleSecretHint => {
  const hintBuffer = Buffer.from(hint, 'base64');
  const hintType = hintBuffer[87] === 1 ? 'proofReal' : 'proofSimulated';
  const proofHex = hintBuffer.subarray(33, 87).toString('hex');
  return {
    hint: hintType,
    position: `0-${index}`,
    challenge: proofHex.substring(0, 48),
    proof: proofHex,
    pubkey: {
      op: '205',
      h: publicKey,
    },
  };
};

/**
 * Generates a hint bag JSON object for a commitment.
 *
 * This function creates a hint bag JSON object that can be used in the transaction hints bag.
 * It takes a public key, commitment, index, secret, and optional password as input.
 *
 * If a secret and password are provided, the function will include the decrypted secret
 * in the hint, which allows the transaction to be signed with this commitment.
 *
 * The commitment should be a base64 encoded string of exactly 32 bytes.
 *
 * @param publicKey - The public key associated with this commitment
 * @param commitment - The base64 encoded commitment (32 bytes)
 * @param index - The index of this commitment in the input
 * @param secret - The encrypted secret corresponding to this commitment (if any)
 * @param password - The password to decrypt the secret (required if secret is provided)
 * @returns A TxSinglePublicHint object that can be included in the transaction hints bag
 */
const generateHintBagJson = (
  publicKey: string,
  commitment: string,
  index: number,
  secret: string,
  password?: string,
): TxSinglePublicHint => {
  const res: TxSinglePublicHint = {
    hint: secret ? 'cmtWithSecret' : 'cmtReal',
    pubkey: {
      op: '205',
      h: publicKey,
    },
    type: 'dlog',
    a: Buffer.from(commitment, 'base64').toString('hex').toLowerCase(),
    position: `0-${index}`,
  };
  if (secret && password) {
    res['secret'] = decrypt(secret, password).toString('hex');
  }
  return res;
};

/**
 * Converts public keys, hints, and secrets to a TransactionHintsBag object for transaction signing.
 *
 * This function processes arrays of public keys, MultiSigHint objects, and secrets to create a structured
 * TransactionHintsBag object that can be used for signing Ergo transactions. The function handles
 * both regular hints (commitments only) and extended hints (with proofs).
 *
 * Key behaviors:
 * - Uses the commit field from each MultiSigHint object directly
 * - When secrets are provided with a password, creates hints with decrypted secrets
 * - Optionally adds proof information to the secretHints section when addSecrets=true and proof exists
 * - Handles base64 encoding/decoding for all cryptographic data
 *
 * When a secret exists for a hint and addSecrets=true, the function will:
 * 1. Generate a public hint without the secret
 * 2. Generate a second hint with the decrypted secret
 * 3. Add proof information to the secretHints section if the hint contains proof data
 *
 * @param publicKeys - 2D array of public keys for each input (hex encoded)
 * @param hints - 2D array of MultiSigHint objects containing commit, proof, and type information
 * @param secrets - Optional 2D array of encrypted secrets corresponding to the hints
 * @param password - Optional password to decrypt secrets (required if secrets are provided)
 * @param addSecrets - Whether to add proof information to secretHints (default: false)
 * @returns A TransactionHintsBag object that can be used for transaction signing
 */
export const toHintBag = (
  publicKeys: Array<Array<string>>,
  hints: Array<Array<MultiSigHint>>,
  secrets: Array<Array<string>> = [],
  password?: string,
  addSecrets: boolean = false,
): wasm.TransactionHintsBag => {
  const publicJson: TxPublicHint = {};
  const secretJson: TxSecretHint = {};

  publicKeys.forEach((inputPublicKeys, index) => {
    secretJson[`${index}`] = [];
    const inputHints = hints[index];

    inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
      if (inputHints[pkIndex]) {
        try {
          // Get the commitment from the MultiSigHint object
          const commitment = inputHints[pkIndex].commit;

          // Check if we have a secret for this hint
          const hasSecret =
            secrets[index] &&
            secrets[index][pkIndex] &&
            secrets[index][pkIndex] !== '';

          // Always generate a hint without secret first
          const knownHint = generateHintBagJson(
            inputPublicKey,
            commitment,
            pkIndex,
            '',
            undefined,
          );

          // Initialize the array if needed
          if (!publicJson[`${index}`]) {
            publicJson[`${index}`] = [];
          }

          // Add the public hint
          publicJson[`${index}`].push(knownHint);

          // If we have a secret and password, generate a second hint with the secret
          if (hasSecret && password) {
            const ownHint = generateHintBagJson(
              inputPublicKey,
              commitment,
              pkIndex,
              secrets[index][pkIndex],
              password,
            );

            // Add the secret hint
            publicJson[`${index}`].push(ownHint);
            if (inputHints[pkIndex].proof && addSecrets) {
              if (!secretJson[`${index}`]) {
                secretJson[`${index}`] = [];
              }
              const secretHint = generateSecretHintBagJson(
                inputPublicKey,
                commitment,
                pkIndex,
              );
              secretJson[`${index}`].push(secretHint);
            }
          }
        } catch (error) {
          console.error('Error processing hint:', error);
        }
      }
    });
  });

  const resJson: TxHintBag = {
    secretHints: secretJson,
    publicHints: publicJson,
  };
  return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
};

export const arrayToProposition = (input: Array<string>): wasm.Propositions => {
  const output = new wasm.Propositions();
  input.forEach((pk) => {
    const proposition = Uint8Array.from(Buffer.from('cd' + pk, 'hex'));
    output.add_proposition_from_byte(proposition);
  });
  return output;
};

export const addressesToPk = (input: Array<string>): Array<string> => {
  return input.map((item) =>
    Buffer.from(wasm.Address.from_base58(item).content_bytes()).toString('hex'),
  );
};
