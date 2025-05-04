import * as wasm from 'ergo-lib-wasm-browser';
import { getProver } from '../wallet';
import { StateWallet } from '@/store/reducer/wallet';
import {
  generateCommitments,
  hintBagToArray,
  overridePublicCommitments,
} from './commitment';
import { storeMultiSigRow } from './store';
import {
  AddressActionRow,
  HintType,
  MultiSigAddressHolder,
  MultiSigData,
  SecretHintType,
  TransactionHintBagType,
  TxHintType,
  TxSecretHintType,
} from '@/types/multi-sig';
import { getTxBoxes } from '../tx';
import { decrypt } from '@/utils/enc';
import getChain from '@/utils/networks';

export const commit = async (
  tx: wasm.ReducedTransaction,
  wallet: StateWallet,
  signer: StateWallet,
  password: string,
  boxes: Array<wasm.ErgoBox>,
  data: MultiSigData,
) => {
  const prover = await getProver(signer, password, wallet.addresses);
  const myCommitments = await generateCommitments(prover, tx);
  const unsigned = tx.unsigned_tx();
  const known = await hintBagToArray(
    wallet,
    signer,
    unsigned,
    boxes,
    myCommitments.public,
  );
  const own = await hintBagToArray(
    wallet,
    signer,
    unsigned,
    boxes,
    myCommitments.private,
    password,
  );
  const newCommitments = overridePublicCommitments(data.commitments, known);
  const newPrivateCommitments = overridePublicCommitments(data.secrets, own);
  if (newCommitments.changed || newPrivateCommitments.changed) {
    const currentTime = Date.now();
    const row = await storeMultiSigRow(
      wallet,
      tx,
      boxes,
      newCommitments.commitments,
      newPrivateCommitments.commitments,
      data.signed,
      data.simulated,
      currentTime,
      data.partial,
    );
    return {
      commitments: newCommitments.commitments,
      secrets: newPrivateCommitments.commitments,
      updateTime: currentTime,
      rowId: row?.id,
      changed: true,
    };
  }
  return {
    commitments: data.commitments,
    secrets: data.secrets,
    updateTime: -1,
    rowId: -1,
    changed: false,
  };
};

const getInputPKs = (
  wallet: StateWallet,
  addresses: Array<MultiSigAddressHolder>,
  tx: wasm.UnsignedTransaction,
  txBoxes: Array<wasm.ErgoBox>,
) => {
  const boxes = getTxBoxes(tx, txBoxes);
  const ergoTrees = wallet.addresses.map((item) =>
    wasm.Address.from_base58(item.address).to_ergo_tree().to_base16_bytes(),
  );
  return boxes
    .map((box) => box.ergo_tree().to_base16_bytes())
    .map((ergoTree) => ergoTrees.indexOf(ergoTree))
    .map((index) =>
      addresses.map((item) => (index === -1 ? '' : item.pubKeys[index])),
    )
    .map((row) => row.sort());
};

const removeSignedCommitments = (
  commitments: Array<Array<string>>,
  inputPKs: Array<Array<string>>,
  myPKs: Array<string>,
  signedPKs: Array<string>,
) => {
  return commitments.map((commitmentRow, rowIndex) => {
    const rowPks = inputPKs[rowIndex];
    return commitmentRow.map((commitment, pkIndex) => {
      const pk = rowPks[pkIndex];
      if (signedPKs.indexOf(pk) >= 0 || myPKs.indexOf(pk) >= 0) {
        return '';
      }
      return commitment;
    });
  });
};

const generateSecretHintBagJson = (
  publicKey: string,
  hint: string,
  index: number,
): SecretHintType => {
  const hintBuffer = Buffer.from(hint, 'base64');
  const hintType = hintBuffer[86] === 1 ? 'proofReal' : 'proofSimulated';
  const proofHex = hintBuffer.slice(32, 86).toString('hex');
  return {
    hint: hintType,
    position: `0-${index}`,
    challenge: proofHex.substr(0, 48),
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
 * @returns A HintType object that can be included in the transaction hints bag
 */
const generateHintBagJson = (
  publicKey: string,
  commitment: string,
  index: number,
  secret: string,
  password?: string,
): HintType => {
  const res: HintType = {
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
 * Converts public keys, hints, and secrets to a HintBag object.
 *
 * This function takes arrays of public keys, hints, and secrets and converts them
 * to a HintBag object that can be used for signing transactions. It ensures that
 * only the first 32 bytes of each hint are used as the commitment.
 *
 * For each hint, the function extracts the first 32 bytes as the commitment and
 * creates a hint bag JSON object. If a secret is provided for the hint, the function
 * will create two hint bag JSON objects - one without the secret and one with the secret.
 * This allows the transaction to be verified and signed with the same commitment.
 *
 * The function is careful to handle base64 encoded data properly, as both the input
 * hints and the generateHintBagJson function work with base64 encoded data.
 *
 * @param publicKeys - 2D array of public keys for each input
 * @param hints - 2D array of hints in the new format (base64 encoded)
 * @param secrets - Optional 2D array of secrets corresponding to the hints
 * @param password - Optional password to decrypt secrets
 * @returns A TransactionHintsBag object that can be used for signing
 */
export const toHintBag = (
  publicKeys: Array<Array<string>>,
  hints: Array<Array<string>>,
  secrets: Array<Array<string>> = [],
  password?: string,
  addSecrets: boolean = false,
): wasm.TransactionHintsBag => {
  const publicJson: TxHintType = {};
  const secretJson: TxSecretHintType = {};

  publicKeys.forEach((inputPublicKeys, index) => {
    secretJson[`${index}`] = [];
    const inputHints = hints[index];

    inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
      if (inputHints[pkIndex]) {
        try {
          // Decode base64 string to byte array
          const decoded = Buffer.from(inputHints[pkIndex], 'base64');

          // Extract only the first 32 bytes (commitment) and convert back to base64
          const commitment = decoded.slice(0, 32).toString('base64');

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
            if (decoded.length > 32 && addSecrets) {
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

  const resJson: TransactionHintBagType = {
    secretHints: secretJson,
    publicHints: publicJson,
  };
  return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
};

const getHintBags = (
  publicKeys: Array<Array<string>>,
  commitments: Array<Array<string>>,
): wasm.TransactionHintsBag => {
  const publicJson: { [key: string]: Array<HintType> } = {};
  const secretJson: { [key: string]: Array<HintType> } = {};
  publicKeys.forEach((inputPublicKeys, index) => {
    const inputCommitments = commitments[index];
    inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
      if (inputCommitments[pkIndex]) {
        const commitment = generateHintBagJson(
          inputPublicKey,
          inputCommitments[pkIndex],
          pkIndex,
          '',
        );
        if (publicJson[`${index}`]) {
          publicJson[`${index}`].push(commitment);
        } else {
          publicJson[`${index}`] = [commitment];
        }
      }
    });
    secretJson[`${index}`] = [];
  });
  const resJson = { secretHints: secretJson, publicHints: publicJson };
  return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
};

const extractAndAddSignedHints = async (
  wallet: StateWallet,
  simulated: Array<string>,
  signed: Array<string>,
  currentHints: wasm.TransactionHintsBag,
  tx: wasm.ReducedTransaction,
  partial?: wasm.Transaction,
  boxes: Array<wasm.ErgoBox> = [],
) => {
  const simulatedPropositions = arrayToProposition(simulated);
  const realPropositions = arrayToProposition(signed);
  const context = getChain(wallet.networkType).fakeContext();
  if (partial) {
    const ergoBoxes = wasm.ErgoBoxes.empty();
    boxes.forEach((box) => ergoBoxes.add(box));
    const hints = wasm.extract_hints(
      partial,
      context,
      ergoBoxes,
      // TODO handle data inputs
      wasm.ErgoBoxes.empty(),
      realPropositions,
      simulatedPropositions,
    );
    Array(tx.unsigned_tx().inputs().len())
      .fill('')
      .forEach((_item, index) => {
        const inputHints = hints.all_hints_for_input(index);
        currentHints.add_hints_for_input(index, inputHints);
      });
  }
};

const addMyHints = (
  commitments: Array<Array<string>>,
  secrets: Array<Array<string>>,
  publicKeys: Array<Array<string>>,
  myPKs: Array<string>,
  password: string,
) => {
  const myHints: TransactionHintBagType = {
    secretHints: {},
    publicHints: {},
  };
  commitments.forEach((row, rowIndex) => {
    if (
      !Object.prototype.hasOwnProperty.call(myHints.publicHints, `${rowIndex}`)
    ) {
      myHints.publicHints[`${rowIndex}`] = [];
      myHints.secretHints[`${rowIndex}`] = [];
    }
    row.forEach((commit, commitIndex) => {
      const secret = secrets[rowIndex][commitIndex];
      if (secret !== '') {
        const committerPK = publicKeys[rowIndex][commitIndex];
        if (myPKs.includes(committerPK)) {
          myHints.publicHints[`${rowIndex}`].push(
            generateHintBagJson(committerPK, commit, commitIndex, ''),
          );
          myHints.publicHints[`${rowIndex}`].push(
            generateHintBagJson(
              committerPK,
              commit,
              commitIndex,
              secret,
              password,
            ),
          );
        }
      }
    });
  });
  return wasm.TransactionHintsBag.from_json(JSON.stringify(myHints));
};

export const sign = async (
  wallet: StateWallet,
  signer: StateWallet,
  simulated: Array<string>,
  commitments: Array<Array<string>>,
  secrets: Array<Array<string>>,
  committed: Array<AddressActionRow>,
  signed: Array<AddressActionRow>,
  addresses: Array<MultiSigAddressHolder>,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  password: string,
  oldPartial?: wasm.Transaction,
): Promise<{
  partial: wasm.Transaction;
  signed: Array<string>;
  simulated: Array<string>;
  currentTime: number;
}> => {
  // generate simulated list
  const simulatedAddress = simulated.length
    ? simulated
    : committed.filter((item) => !item.completed).map((item) => item.address);

  // generate signed
  const signedAddresses = signed
    .filter((item) => item.completed)
    .map((item) => item.address);
  const signedPKs = addresses
    .filter((item) => signedAddresses.includes(item.address))
    .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
  const myPKs = addresses
    .filter((item) => item.address == signer.addresses[0].address)
    .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
  const unsigned = tx.unsigned_tx();
  const inputPKs = getInputPKs(wallet, addresses, unsigned, boxes);
  const myHints = addMyHints(commitments, secrets, inputPKs, myPKs, password);
  const usedCommitments = removeSignedCommitments(
    commitments,
    inputPKs,
    myPKs,
    signedPKs,
  );
  const publicHintBag = getHintBags(inputPKs, usedCommitments);
  if (signedPKs && signedPKs.length > 0) {
    const simulatedPKs = addresses
      .filter((item) => simulatedAddress.includes(item.address))
      .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
    await extractAndAddSignedHints(
      wallet,
      simulatedPKs,
      signedPKs,
      publicHintBag,
      tx,
      oldPartial,
      boxes,
    );
  }
  Array(unsigned.inputs().len())
    .fill('')
    .forEach((_item, index) => {
      const myInputHints = myHints.all_hints_for_input(index);
      publicHintBag.add_hints_for_input(index, myInputHints);
    });
  const prover = await getProver(signer, password, wallet.addresses);
  const partial = prover.sign_reduced_transaction_multi(tx, publicHintBag);
  const lastSigned = [...signedAddresses, signer.addresses[0].address].sort();
  const currentTime = Date.now();
  await storeMultiSigRow(
    wallet,
    tx,
    boxes,
    commitments,
    secrets,
    lastSigned,
    simulatedAddress,
    currentTime,
    partial,
  );

  return {
    signed: lastSigned,
    simulated: simulatedAddress,
    partial,
    currentTime,
  };
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
