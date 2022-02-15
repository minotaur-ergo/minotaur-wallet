import { PAGE_SIZE } from "../config/const";
import * as dbTxAction from "../db/action/transaction";
import * as dbBoxAction from "../db/action/box";
import * as dbBoxContentAction from "../db/action/boxContent";
import Address from "../db/entities/Address";
import Tx, { TxStatus } from "../db/entities/Tx";
import { ErgoTx } from "../network/models";
import { Paging } from "../network/paging";
import { setAddressHeight } from "../db/action/address";
import * as dbTransactionActions from "../db/action/transaction";
import { getNetworkType } from "../config/network_type";


const processAddressOutputBoxes = async (address: Address, height: number) => {
    const txs = await dbTransactionActions.getNetworkTxs(address.network_type, address.tx_create_box_height, height);
    for(let tx of txs) {
        if(tx.height <= height) {
            await processTxOutputBoxes(tx, address)
        }
    }
    await setAddressHeight(address.id, height, 'tx_create_box')
}

const processTxOutputBoxes = async ( tx: Tx, address: Address) => {
    let index = 0;
    const txJson: ErgoTx = JSON.parse(tx.json);
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

const processAddressInputBoxes = async (address: Address, height: number) => {
    const txs = await dbTransactionActions.getNetworkTxs(address.network_type, address.tx_spent_box_height, height);
    for(let tx of txs) {
        if(tx.height <= height) {
            await processSpentTransaction(tx, address)
        }
    }
    await setAddressHeight(address.id, height, 'tx_spent_box')
}

const processSpentTransaction = async (tx: Tx, address: Address) => {
    let index = 0;
    const txJson: ErgoTx = JSON.parse(tx.json);
    for (let input of txJson.inputs) {
        if (input.address === address.address) {
            await dbBoxAction.spentBox(input.boxId, tx, index);
        }
        index += 1;
    }
};

const getMinedTxForAddress = async (address: Address, fromHeight: number, blocks: { [height: number]: string }) => {
    const explorer = getNetworkType(address.network_type).getExplorer()
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
            if (tx.inclusionHeight >= fromHeight || tx.inclusionHeight > address.tx_load_height) {
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
        await dbTxAction.updateOrCreateTx(tx, TxStatus.Mined, address.network_type);
    }
    await setAddressHeight(address.id, maxBlockHeight, 'tx_load')
};

// const getMemPoolTxForAddress = async (address: Address) => {
//     let offset = 0;
//     while (true) {
//         const txs = (await explorer.getUTxsByAddress(address.address, { offset: offset, limit: PAGE_SIZE })).items;
//
//     }
// };


export {
    getMinedTxForAddress,
    processAddressOutputBoxes,
    processAddressInputBoxes
};
