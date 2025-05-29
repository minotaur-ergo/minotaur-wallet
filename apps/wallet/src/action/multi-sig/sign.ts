import { storeMultiSigRow } from '@/action/multi-sig/store';
import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import { getProver } from '@/action/wallet';
import { StateWallet } from '@/store/reducer/wallet';
import { TxHintBag } from '@/types/multi-sig';
import { MultiSigDataHint, MultiSigDataHintType } from '@/types/multi-sig/hint';
import { boxArrayToBoxes } from '@/utils/convert';
import fakeContext from '@/utils/networks/fakeContext';
import * as wasm from 'ergo-lib-wasm-browser';

const arrayToProposition = (input: Array<string>): wasm.Propositions => {
  const output = new wasm.Propositions();
  input.forEach((pk) => {
    const proposition = Uint8Array.from(Buffer.from('cd' + pk, 'hex'));
    output.add_proposition_from_byte(proposition);
  });
  return output;
};

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
  const inputPKs = await getInputPks(wallet, signer, unsigned, boxes);
  const hintJson: TxHintBag = { secretHints: {}, publicHints: {} };
  hints.forEach((hintRow, inputIndex) => {
    hintJson.secretHints[`${inputIndex}`] = hintRow
      .map((hint) => {
        return hint.generateSecretHint(inputPKs);
      })
      .flat();
    hintJson.publicHints[`${inputIndex}`] = hintRow
      .map((hint) => {
        return hint.generatePublicHint(inputPKs);
      })
      .flat();
  });
  const txHintbag = wasm.TransactionHintsBag.from_json(
    JSON.stringify(hintJson),
  );
  const prover = await getProver(signer, password);
  const partialSigned = prover.sign_reduced_transaction_multi(tx, txHintbag);
  const signedPks = await getMyInputPks(wallet, signer, unsigned, boxes);
  const simulatedPks: Array<string> = hints
    .map((hintRow, inputIndex) => {
      return hintRow.map((hint, signerIndex) => {
        if (hint.Commit === '' || hint.Type === MultiSigDataHintType.SIMULATED)
          return inputPKs[inputIndex][signerIndex];
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
  const currentTime = Date.now();
  await storeMultiSigRow(wallet, tx, boxes, updatedHints, currentTime);
  return {
    hints: updatedHints,
    currentTime,
  };
};
