import { MultiSigDataHint } from '@/types/multi-sig/hint';
import * as wasm from 'ergo-lib-wasm-browser';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigAddressHolder, MultiSigData } from '@/types/multi-sig';

export const commit = async (
  tx: wasm.ReducedTransaction,
  wallet: StateWallet,
  signer: StateWallet,
  password: string,
  boxes: Array<wasm.ErgoBox>,
  data: MultiSigData,
) => {
  console.log(tx, wallet, signer, password, boxes, data);
  // const prover = await getProver(signer, password, wallet.addresses);
  // const myCommitments = await generateCommitments(prover, tx);
  // const unsigned = tx.unsigned_tx();
  // const known = await hintBagToArray(
  //   wallet,
  //   signer,
  //   unsigned,
  //   boxes,
  //   myCommitments.public,
  // );
  // const own = await hintBagToArray(
  //   wallet,
  //   signer,
  //   unsigned,
  //   boxes,
  //   myCommitments.private,
  //   password,
  // );
  // const newCommitments = overridePublicCommitments(data.commitments, known);
  // const newPrivateCommitments = overridePublicCommitments(data.secrets, own);
  // if (newCommitments.changed || newPrivateCommitments.changed) {
  //   const currentTime = Date.now();
  //   const row = await storeMultiSigRow(
  //     wallet,
  //     tx,
  //     boxes,
  //     newCommitments.commitments,
  //     newPrivateCommitments.commitments,
  //     data.signed,
  //     data.simulated,
  //     currentTime,
  //     data.partial,
  //   );
  //   return {
  //     commitments: newCommitments.commitments,
  //     secrets: newPrivateCommitments.commitments,
  //     updateTime: currentTime,
  //     rowId: row?.id,
  //     changed: true,
  //   };
  // }
  // return {
  //   commitments: data.commitments,
  //   secrets: data.secrets,
  //   updateTime: -1,
  //   rowId: -1,
  //   changed: false,
  // };
};

// const getInputPKs = (
//   wallet: StateWallet,
//   addresses: Array<MultiSigAddressHolder>,
//   tx: wasm.UnsignedTransaction,
//   txBoxes: Array<wasm.ErgoBox>,
// ) => {
//   const boxes = getTxBoxes(tx, txBoxes);
//   const ergoTrees = wallet.addresses.map((item) =>
//     wasm.Address.from_base58(item.address).to_ergo_tree().to_base16_bytes(),
//   );
//   return boxes
//     .map((box) => box.ergo_tree().to_base16_bytes())
//     .map((ergoTree) => ergoTrees.indexOf(ergoTree))
//     .map((index) =>
//       addresses.map((item) => (index === -1 ? '' : item.pubKeys[index])),
//     )
//     .map((row) => row.sort());
// };
//
// const removeSignedCommitments = (
//   commitments: Array<Array<string>>,
//   inputPKs: Array<Array<string>>,
//   myPKs: Array<string>,
//   signedPKs: Array<string>,
// ) => {
//   return commitments.map((commitmentRow, rowIndex) => {
//     const rowPks = inputPKs[rowIndex];
//     return commitmentRow.map((commitment, pkIndex) => {
//       const pk = rowPks[pkIndex];
//       if (signedPKs.indexOf(pk) >= 0 || myPKs.indexOf(pk) >= 0) {
//         return '';
//       }
//       return commitment;
//     });
//   });
// };

// const generateHintBagJson = (
//   publicKey: string,
//   commitment: string,
//   index: number,
//   secret: string,
//   password?: string,
// ): HintType => {
//   const res: HintType = {
//     hint: secret ? 'cmtWithSecret' : 'cmtReal',
//     pubkey: {
//       op: '205',
//       h: publicKey,
//     },
//     type: 'dlog',
//     a: Buffer.from(commitment, 'base64').toString('hex').toLowerCase(),
//     position: `0-${index}`,
//   };
//   if (secret && password) {
//     res['secret'] = decrypt(secret, password).toString('hex');
//   }
//   return res;
// };

// const getHintBags = (
//   publicKeys: Array<Array<string>>,
//   commitments: Array<Array<string>>,
// ): wasm.TransactionHintsBag => {
//   const publicJson: { [key: string]: Array<HintType> } = {};
//   const secretJson: { [key: string]: Array<HintType> } = {};
//   publicKeys.forEach((inputPublicKeys, index) => {
//     const inputCommitments = commitments[index];
//     inputPublicKeys.forEach((inputPublicKey, pkIndex) => {
//       if (inputCommitments[pkIndex]) {
//         const commitment = generateHintBagJson(
//           inputPublicKey,
//           inputCommitments[pkIndex],
//           pkIndex,
//           '',
//         );
//         if (publicJson[`${index}`]) {
//           publicJson[`${index}`].push(commitment);
//         } else {
//           publicJson[`${index}`] = [commitment];
//         }
//       }
//     });
//     secretJson[`${index}`] = [];
//   });
//   const resJson = { secretHints: secretJson, publicHints: publicJson };
//   return wasm.TransactionHintsBag.from_json(JSON.stringify(resJson));
// };
//
// const extractAndAddSignedHints = async (
//   wallet: StateWallet,
//   simulated: Array<string>,
//   signed: Array<string>,
//   currentHints: wasm.TransactionHintsBag,
//   tx: wasm.ReducedTransaction,
//   partial?: wasm.Transaction,
//   boxes: Array<wasm.ErgoBox> = [],
// ) => {
//   const simulatedPropositions = arrayToProposition(simulated);
//   const realPropositions = arrayToProposition(signed);
//   const context = getChain(wallet.networkType).fakeContext();
//   if (partial) {
//     const ergoBoxes = wasm.ErgoBoxes.empty();
//     boxes.forEach((box) => ergoBoxes.add(box));
//     const hints = wasm.extract_hints(
//       partial,
//       context,
//       ergoBoxes,
//       // TODO handle data inputs
//       wasm.ErgoBoxes.empty(),
//       realPropositions,
//       simulatedPropositions,
//     );
//     Array(tx.unsigned_tx().inputs().len())
//       .fill('')
//       .forEach((_item, index) => {
//         const inputHints = hints.all_hints_for_input(index);
//         currentHints.add_hints_for_input(index, inputHints);
//       });
//   }
// };
//
// const addMyHints = (
//   commitments: Array<Array<string>>,
//   secrets: Array<Array<string>>,
//   publicKeys: Array<Array<string>>,
//   myPKs: Array<string>,
//   password: string,
// ) => {
//   const myHints: TransactionHintBagType = {
//     secretHints: {},
//     publicHints: {},
//   };
//   commitments.forEach((row, rowIndex) => {
//     if (
//       !Object.prototype.hasOwnProperty.call(myHints.publicHints, `${rowIndex}`)
//     ) {
//       myHints.publicHints[`${rowIndex}`] = [];
//       myHints.secretHints[`${rowIndex}`] = [];
//     }
//     row.forEach((commit, commitIndex) => {
//       const secret = secrets[rowIndex][commitIndex];
//       if (secret !== '') {
//         const committerPK = publicKeys[rowIndex][commitIndex];
//         if (myPKs.includes(committerPK)) {
//           myHints.publicHints[`${rowIndex}`].push(
//             generateHintBagJson(committerPK, commit, commitIndex, ''),
//           );
//           myHints.publicHints[`${rowIndex}`].push(
//             generateHintBagJson(
//               committerPK,
//               commit,
//               commitIndex,
//               secret,
//               password,
//             ),
//           );
//         }
//       }
//     });
//   });
//   return wasm.TransactionHintsBag.from_json(JSON.stringify(myHints));
// };

export const sign = async (
  wallet: StateWallet,
  signer: StateWallet,
  hints: Array<Array<MultiSigDataHint>>,
  secrets: Array<Array<string>>,
  addresses: Array<MultiSigAddressHolder>,
  tx: wasm.ReducedTransaction,
  boxes: Array<wasm.ErgoBox>,
  password: string,
): Promise<{
  hints: Array<Array<MultiSigDataHint>>;
  currentTime: number;
}> => {
  console.log(wallet, signer, secrets, addresses, tx, boxes, password);
  // generate simulated list
  // const simulatedAddress = simulated.length
  //   ? simulated
  //   : committed.filter((item) => !item.completed).map((item) => item.address);
  //
  // // generate signed
  // const signedAddresses = signed
  //   .filter((item) => item.completed)
  //   .map((item) => item.address);
  // const signedPKs = addresses
  //   .filter((item) => signedAddresses.includes(item.address))
  //   .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
  // const myPKs = addresses
  //   .filter((item) => item.address == signer.addresses[0].address)
  //   .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
  // const unsigned = tx.unsigned_tx();
  // const inputPKs = getInputPKs(wallet, addresses, unsigned, boxes);
  // const myHints = addMyHints(commitments, secrets, inputPKs, myPKs, password);
  // const usedCommitments = removeSignedCommitments(
  //   commitments,
  //   inputPKs,
  //   myPKs,
  //   signedPKs,
  // );
  // const publicHintBag = getHintBags(inputPKs, usedCommitments);
  // if (signedPKs && signedPKs.length > 0) {
  //   const simulatedPKs = addresses
  //     .filter((item) => simulatedAddress.includes(item.address))
  //     .reduce((a, b) => [...a, ...b.pubKeys], [] as Array<string>);
  //   await extractAndAddSignedHints(
  //     wallet,
  //     simulatedPKs,
  //     signedPKs,
  //     publicHintBag,
  //     tx,
  //     oldPartial,
  //     boxes,
  //   );
  // }
  // Array(unsigned.inputs().len())
  //   .fill('')
  //   .forEach((_item, index) => {
  //     const myInputHints = myHints.all_hints_for_input(index);
  //     publicHintBag.add_hints_for_input(index, myInputHints);
  //   });
  // const prover = await getProver(signer, password, wallet.addresses);
  // const partial = prover.sign_reduced_transaction_multi(tx, publicHintBag);
  // const lastSigned = [...signedAddresses, signer.addresses[0].address].sort();
  // const currentTime = Date.now();
  // await storeMultiSigRow(
  //   wallet,
  //   tx,
  //   boxes,
  //   commitments,
  //   secrets,
  //   lastSigned,
  //   simulatedAddress,
  //   currentTime,
  //   partial,
  // );

  return {
    hints,
    currentTime: Date.now(),
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
