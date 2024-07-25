import { getInputPks, getMyInputPks } from '@/action/multi-sig/wallet-keys';
import * as wasm from 'ergo-lib-wasm-browser';
import { addressesToPk, arrayToProposition } from './signing';
import getChain from '@/utils/networks';
import { MultiSigDataRow, MultiSigShareData } from '@/types/multi-sig';
import { deserialize } from '../box';
import {
  fetchMultiSigRows,
  notAvailableAddresses,
  storeMultiSigRow,
  updateMultiSigRow,
} from './store';
import { StateWallet } from '@/store/reducer/wallet';
import { dottedText } from '@/utils/functions';
import { boxArrayToBoxes, boxesToArrayBox } from '@/utils/convert';
import { hintBagToArray } from './commitment';

interface VerificationResponse {
  valid: boolean;
  message: string;
  txId?: string;
}

// verify commitments
// my commitment must not change
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
      row.filter((item, itemIndex) => {
        if (
          oldCommitments[rowIndex][itemIndex] !== item &&
          filteredMyPks[rowIndex][itemIndex] !== ''
        ) {
          return true;
        }
      });
    }).length === 0;
  return {
    valid,
    message: valid
      ? ''
      : 'Your commitment changed.\nThis transaction can not sign anymore.\nPlease try sign it again from beginning',
  };
};

// verify commitments
// my wallet must not commit new transaction
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

const verifyTxAddresses = (
  tx: wasm.ReducedTransaction,
  commitments: Array<Array<string>>,
  boxes: Array<wasm.ErgoBox>,
  wallet: StateWallet,
): VerificationResponse => {
  // verify addresses
  const invalidAddresses = notAvailableAddresses(
    wallet,
    commitments,
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

// verify inputs
// verify all inputs of transaction exists in list of boxes
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

// verify partial
// verify used commitment is valid for tx
const verifyTxPartial = async (
  wallet: StateWallet,
  signer: StateWallet,
  signed: Array<string>,
  simulated: Array<string>,
  partialBase64: string,
  networkType: string,
  boxes: wasm.ErgoBoxes,
  dataBoxes: wasm.ErgoBoxes = wasm.ErgoBoxes.empty(),
  commitments: Array<Array<string>>,
): Promise<VerificationResponse> => {
  const simulatedPropositions = arrayToProposition(addressesToPk(simulated));
  const realPropositions = arrayToProposition(addressesToPk(signed));
  const context = getChain(networkType).fakeContext();
  const hints = wasm.extract_hints(
    wasm.Transaction.sigma_parse_bytes(Buffer.from(partialBase64, 'base64')),
    context,
    boxes,
    dataBoxes,
    realPropositions,
    simulatedPropositions,
  );
  const converted = await hintBagToArray(
    wallet,
    signer,
    wasm.Transaction.sigma_parse_bytes(Buffer.from(partialBase64, 'base64')),
    boxesToArrayBox(boxes),
    hints,
  );
  console.log(converted, commitments);
  console.log(hints.to_json());
  return { valid: true, message: '' };
  // compare hints with commitments
};

const verifyNotSigningNewTx = (
  sharedData: MultiSigShareData,
): VerificationResponse => {
  if (
    (sharedData.signed ?? []).length > 0 ||
    (sharedData.simulated ?? []).length > 0 ||
    (sharedData.partial ?? '').length > 0
  )
    return {
      valid: false,
      message: 'Transaction already signing without your commitment',
    };
  return { valid: true, message: '' };
};

const verifyNewTx = async (
  sharedData: MultiSigShareData,
  wallet: StateWallet,
  signer: StateWallet,
): Promise<VerificationResponse> => {
  const tx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(sharedData.tx, 'base64'),
  );
  const boxes = sharedData.boxes.map(deserialize);
  const notSigning = verifyNotSigningNewTx(sharedData);
  if (!notSigning.valid) return notSigning;
  const txInputsValid = verifyTxInputs(tx, boxes);
  if (!txInputsValid.valid) return txInputsValid;
  const unsigned = tx.unsigned_tx();
  const pks = await getInputPks(wallet, signer, unsigned, boxes);
  const myPks = await getMyInputPks(wallet, signer, unsigned, boxes);
  const notCommittedValid = verifyNotCommittedNewTx(
    sharedData.commitments,
    pks,
    myPks,
  );
  if (!notCommittedValid.valid) return notCommittedValid;
  return verifyTxAddresses(tx, sharedData.commitments, boxes, wallet);
};

const verifyExistingTx = async (
  sharedData: MultiSigShareData,
  wallet: StateWallet,
  signer: StateWallet,
  row?: MultiSigDataRow,
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
  if (!row) {
    return {
      valid: false,
      message: 'Invalid transaction entered',
    };
  }
  const boxes = sharedData.boxes.map(deserialize);
  const verifyInputs = verifyTxInputs(tx, boxes);
  if (!verifyInputs.valid) return verifyInputs;
  const verifyAddress = verifyTxAddresses(
    tx,
    sharedData.commitments,
    boxes,
    wallet,
  );
  if (!verifyAddress.valid) return verifyAddress;
  const unsigned = tx.unsigned_tx();
  const pks = await getInputPks(wallet, signer, unsigned, boxes);
  const myPks = await getMyInputPks(wallet, signer, unsigned, boxes);
  const verifyCommitments = verifyMyCommitments(
    sharedData.commitments,
    row.commitments,
    pks,
    myPks,
  );
  if (!verifyCommitments.valid) return verifyCommitments;
  if (sharedData.partial && sharedData.signed && sharedData.simulated) {
    const verifyPartial = await verifyTxPartial(
      wallet,
      signer,
      sharedData.signed,
      sharedData.simulated,
      sharedData.partial,
      wallet.networkType,
      boxArrayToBoxes(boxes),
      wasm.ErgoBoxes.empty(),
      row.commitments,
    );
    if (!verifyPartial.valid) return verifyPartial;
  }
  return { valid: true, message: '' };
  //   return { valid: false, message: 'Must not update this' };
};

const verifyAndSaveData = async (
  data: MultiSigShareData,
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
    : verifyExistingTx(
        data,
        wallet,
        signer,
        filteredRow.length === 0 ? undefined : filteredRow[0],
        txId,
      ));
  if (!verification.valid) return verification;
  if (filteredRow.length > 0) {
    const row = filteredRow[0];
    await updateMultiSigRow(
      row.rowId,
      data.commitments,
      row.secrets,
      data.signed || [],
      data.simulated || [],
      Date.now(),
      data.partial
        ? wasm.Transaction.sigma_parse_bytes(
            Buffer.from(data.partial, 'base64'),
          )
        : undefined,
    );
  } else {
    await storeMultiSigRow(
      wallet,
      tx,
      data.boxes.map(deserialize),
      data.commitments,
      [[]],
      data.signed || [],
      data.simulated || [],
      Date.now(),
      data.partial
        ? wasm.Transaction.sigma_parse_bytes(
            Buffer.from(data.partial, 'base64'),
          )
        : undefined,
    );
  }
  return {
    valid: true,
    message: 'Updated Successfully',
    txId: tx.unsigned_tx().id().to_str(),
  };
};

export { verifyNewTx, verifyExistingTx, verifyAndSaveData };
