import * as wasm from 'ergo-lib-wasm-browser';
import { arrayToProposition } from './signing';
import getChain from '@/utils/networks';
import { TransactionHintBagType } from '@/types/multi-sig';

// verify commitments
// Only verify my commitment must not changed
const verifyMyCommitments = (
    commitments: Array<Array<string>>,
    oldCommitments: Array<Array<string>>,
    pks: Array<Array<string>>,
    myPks: Array<string>,
) => {
    const filteredMyPks = pks.map(row => row.map(item => myPks.indexOf(item) === -1 ? '' : item))
    return commitments.filter((row, rowIndex) => {
        row.filter((item, itemIndex) => {
            if(oldCommitments[rowIndex][itemIndex] !== item && filteredMyPks[rowIndex][itemIndex] !== ''){
                return true
            }
        })
    }).length === 0
}

// verify inputs
// verify all inputs of transaction exists in list of boxes
// verify input changed
const verifyTxInputs = (
    tx: wasm.ReducedTransaction,
    boxes: Array<wasm.ErgoBox>,
) => {
    const inputs = tx.unsigned_tx().inputs()
    for(let index = 0; index < inputs.len(); index ++){
        const input = inputs.get(index);
        if(boxes.filter(item => item.box_id().to_str() === input.box_id().to_str()).length !== 1){
            return false;
        }
    }
    return true;
}

// verify partial
// verify used commitment is valid for tx
const verifyPartial = async (
    // commitments: Array<Array<string>>,
    signed: Array<string>,
    simulated: Array<string>,
    partial: wasm.Transaction,
    networkType: string,
    boxes: wasm.ErgoBoxes,
    dataBoxes: wasm.ErgoBoxes = wasm.ErgoBoxes.empty()
) => {
    const simulatedPropositions = arrayToProposition(simulated);
    const realPropositions = arrayToProposition(signed);
    const context = await getChain(networkType).fakeContext();
    const hints = wasm.extract_hints(
        partial,
        context,
        boxes,
        dataBoxes,
        realPropositions,
        simulatedPropositions,
    ).to_json() as TransactionHintBagType;
    // compare hints with commitments
    
}

export {
    verifyMyCommitments,
    verifyTxInputs,
    verifyPartial,
}