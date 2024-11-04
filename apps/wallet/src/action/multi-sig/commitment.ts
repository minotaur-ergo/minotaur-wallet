import * as wasm from 'ergo-lib-wasm-browser';
import { StateWallet } from '@/store/reducer/wallet';
import { encrypt } from '@/utils/enc';
import { getInputPks } from './wallet-keys';

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

const commitmentToByte = (
  commitment: wasm.TransactionHintsBag,
  inputPublicKeys: Array<Array<string>>,
  password?: string,
): Array<Array<string>> => {
  const json = commitment.to_json()['publicHints'];
  return inputPublicKeys.map((rowPublicKeys, index) => {
    const hints = json[`${index}`] || [];
    const rowCommitments = rowPublicKeys.map(() => '');
    hints.forEach(
      (item: { hint: string, pubkey: { h: string }; a: string; secret: string }) => {
        if(item.hint.indexOf('Simulated') === -1) {
          const pubIndex = rowPublicKeys.indexOf(item.pubkey.h);
          if (pubIndex >= 0)
            rowCommitments[pubIndex] =
              password !== undefined
                ? encrypt(Buffer.from(item.secret, 'hex'), password)
                : Buffer.from(item.a, 'hex').toString('base64');
        }
      },
    );
    return rowCommitments;
  });
};

const overridePublicCommitments = (
  baseCommitments: Array<Array<string>>,
  override: Array<Array<string>>,
): { commitments: Array<Array<string>>; changed: boolean } => {
  if (baseCommitments.length !== override.length) {
    return { commitments: [...override], changed: true };
  }
  let changed = false;
  const commitments = baseCommitments.map((inputCommitments, index) => {
    const overrideRow = override[index];
    return inputCommitments.map((commitment, index) => {
      if (overrideRow[index] !== commitment && overrideRow[index] !== '') {
        changed = true;
        return overrideRow[index];
      }
      return overrideRow[index] ? overrideRow[index] : commitment;
    });
  });
  return {
    commitments: commitments,
    changed: changed,
  };
};

const generateCommitments = async (
  wallet: wasm.Wallet,
  tx: wasm.ReducedTransaction,
) => {
  const commitment = wallet.generate_commitments_for_reduced_transaction(tx);
  return extractCommitments(commitment, tx.unsigned_tx().inputs().len());
};

const hintBagToArray = async (
  wallet: StateWallet,
  signerWallet: StateWallet,
  tx: wasm.UnsignedTransaction | wasm.Transaction,
  boxes: Array<wasm.ErgoBox>,
  commitment: wasm.TransactionHintsBag,
  password?: string,
) => {
  const inputPKs = await getInputPks(wallet, signerWallet, tx, boxes);
  return commitmentToByte(commitment, inputPKs, password);
};

export {
  generateCommitments,
  overridePublicCommitments,
  commitmentToByte,
  hintBagToArray,
};
