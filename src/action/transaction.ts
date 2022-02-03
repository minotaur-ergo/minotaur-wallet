import explorer from "../network/explorer";
import { PAGE_SIZE } from "../config/const";
import * as dbTxAction from "../db/action/transaction";
import * as dbBoxAction from "../db/action/box";
import * as dbBoxContentAction from "../db/action/boxContent";
import Address from "../db/entities/Address";
import Tx, { TxStatus } from "../db/entities/Tx";
import { ErgoTx } from "../network/models";
import { makeAddressAsProceed } from "../db/action/address";
import { Paging } from "../network/paging";

const processTransaction = async (txJson: ErgoTx, address: Address, type: TxStatus) => {
    const { status, tx } = await dbTxAction.updateOrCreateTx(txJson, type);
    if (tx) {
        await processTxOutputBoxes(txJson, tx, address);
    }
    return status === TxStatus.Mined ? txJson.inclusionHeight : 0;
};

const processTxOutputBoxes = async (txJson: ErgoTx, tx: Tx, address: Address) => {
    let index = 0;
    for (let box of txJson.outputs) {
        if (box.address === address.address) {
            const boxEntity = await dbBoxAction.createOrUpdateBox(box, address, tx, index);
            if (boxEntity) {
                for (let token of box.assets) {
                    await dbBoxContentAction.createOrUpdateBoxContent(boxEntity, token);
                }
            }
        }
        index += 0;
    }
};

const processSpentTransaction = async (txJson: ErgoTx, tx: Tx, address: Address) => {
    let index = 0;
    for (let input of txJson.inputs) {
        if (input.address === address.address) {
            await dbBoxAction.spentBox(input.boxId, tx, index);
        }
        index += 1;
    }
};

const getMinedTxForAddress = async (address: Address, fromHeight: number, blocks: { [height: number]: string }) => {
    let txList: Array<ErgoTx> = [];
    const heights = Object.keys(blocks).map(item => Number(item));
    const maxBlockHeight = Math.max(...heights);
    const minBlockHeight = Math.min(...heights);
    let breakProcess: boolean = false;
    const paging: Paging = {offset: 0, limit: 1}
    // fetch all transaction from fromHeight to maxHeight
    while (!breakProcess) {
        const txs = (await explorer.getTxsByAddress(address.address, paging)).items;
        for (let tx of txs) {
            if (tx.inclusionHeight >= fromHeight || address.is_new) {
                if (tx.inclusionHeight >= maxBlockHeight) continue;
                if(tx.inclusionHeight >= minBlockHeight && blocks[tx.inclusionHeight] !== tx.blockId) continue;// forked transaction arrived
                txList.push(tx);
            } else {
                breakProcess = true;
                break;
            }
        }
        if (breakProcess || txs.length === 0) {
            break;
        }
        paging.offset += paging.limit;
        paging.limit = Math.min(PAGE_SIZE, paging.limit + 5)
    }
    for (let tx of txList) {
        await processTransaction(tx, address, TxStatus.Mined);
    }
    for (let txJson of txList) {
        let tx = await dbTxAction.getTxByTxId(txJson.id);
        if (tx) {
            await processSpentTransaction(txJson, tx, address);
        }
    }
    if(address.is_new) await makeAddressAsProceed(address)
};

// const getMemPoolTxForAddress = async (address: Address) => {
//     let offset = 0;
//     while (true) {
//         const txs = (await explorer.getUTxsByAddress(address.address, { offset: offset, limit: PAGE_SIZE })).items;
//
//     }
// };

export {
    getMinedTxForAddress
};
