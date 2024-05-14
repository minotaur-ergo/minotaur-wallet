import * as wasm from 'ergo-lib-wasm-browser';

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
const verifyPartial = (
    commitments: Array<Array<string>>,
    signed: Array<string>,
    simulated: Array<string>,
    partial: wasm.Transaction,
) => {
    console.log(commitments, signed, simulated, partial)
}

export {
    verifyMyCommitments,
    verifyTxInputs,
    verifyPartial,
}