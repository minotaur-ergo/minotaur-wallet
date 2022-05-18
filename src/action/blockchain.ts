import * as wasm from "ergo-lib-wasm-browser";
import { is_valid_address, sum_erg_and_nano_erg } from "../util/util";
import { CONFIRMATION_HEIGHT, FEE, PAGE_SIZE } from "../util/const";
import Wallet from "../db/entities/Wallet";
import Address from "../db/entities/Address";
import Asset from "../db/entities/Asset";
import { getNetworkType, NetworkType } from "../util/network_type";
import { UnsignedGeneratedTx } from "../util/interface";
import { AddressDbAction, AssetDbAction, BlockDbAction, BoxContentDbAction, BoxDbAction, TxDbAction } from "./db";
import { AddressAction } from "./action";
import { Paging } from "../util/network/paging";
import Tx, { TxStatus } from "../db/entities/Tx";
import { ErgoTx } from "../util/network/models";

export interface TxWithJson extends Tx {
    jsonBi: ErgoTx;
}

const pageSize: number = 20;

class ReceiverToken {
    readonly token_id: string;
    amount_str: string;
    private asset?: Asset;
    private readonly network_type: string;

    constructor(token_id: string, amount: string, network_type: string, asset?: Asset) {
        this.token_id = token_id;
        this.amount_str = amount;
        this.network_type = network_type;
        if (asset) {
            this.asset = asset;
        } else {
            AssetDbAction.getAssetByAssetId(this.token_id, this.network_type).then(asset => this.asset = asset ? asset : undefined);
        }
    }

    clone = () => {
        return new ReceiverToken(this.token_id, this.amount_str, this.network_type, this.asset);
    };

    amount = () => {
        const parts = this.amount_str.split(".");
        const decimal_point = this.asset && this.asset.decimal ? this.asset.decimal : 0;
        const count_str = parts[0];
        let decimal_count = parts[1] ? parts[1] : "0";
        decimal_count = decimal_count.padEnd(decimal_point, "0").substr(0, decimal_point);
        return BigInt(count_str + decimal_count);
    };

    valid = () => {
        const valid_id = this.token_id.length === 64;
        const valid_amount = !isNaN(Number(this.amount_str));
        return valid_id && valid_amount;
    };
}

class Receiver {
    address: string = "";
    erg_str: string = "";
    tokens: Array<ReceiverToken> = [];

    clone = () => {
        const res = new Receiver(this.address, this.erg_str);
        this.tokens.forEach(token => res.tokens.push(token.clone()));
        return res;
    };

    erg = () => {
        const parts = this.erg_str.split(".");
        const ergStr = parts[0];
        let nanoErgStr = parts[1] ? parts[1] : "0";
        while (nanoErgStr.length < 9) {
            nanoErgStr += "0";
        }
        return sum_erg_and_nano_erg(Number(ergStr), Number(nanoErgStr));
    };

    constructor(address: string, erg: string) {
        this.address = address;
        this.erg_str = erg;
    }

    valid = () => {
        const valid_address = is_valid_address(this.address);
        const valid_amount = !isNaN(Number(this.erg_str)) && this.erg_str !== "";
        const valid_token = this.tokens.filter(item => !item.valid()).length === 0;
        return valid_address && valid_amount && valid_token;
    };
}

class BlockChainActionClass {
    private bigintToBoxValue = (num: bigint) => wasm.BoxValue.from_i64(wasm.I64.from_str(num.toString()));

    private getReceiverAmount = (receivers: Array<Receiver>) => receivers.map(receiver => receiver.erg()).reduce((a, b) => a + b);

    private createContext = async (network_type: string) => {
        const node = getNetworkType(network_type).getNode();
        const networkContext = await node.getNetworkContext();
        const blockHeaders = wasm.BlockHeaders.from_json(networkContext.lastBlocks);
        const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
        return new wasm.ErgoStateContext(pre_header, blockHeaders);
    };

    createTx = async (receivers: Array<Receiver>, wallet: Wallet, inputAddress?: Array<Address>): Promise<UnsignedGeneratedTx> => {
        const node = getNetworkType(wallet.network_type).getNode();
        const height = await node.getHeight();
        let totalRequired = this.getReceiverAmount(receivers) + FEE;
        let candidates: wasm.ErgoBoxCandidates = wasm.ErgoBoxCandidates.empty();
        const tokens: { [id: string]: bigint } = {};
        receivers.forEach(receiver => {
            const contract = wasm.Contract.pay_to_address(wasm.Address.from_base58(receiver.address));
            const boxBuilder = new wasm.ErgoBoxCandidateBuilder(this.bigintToBoxValue(receiver.erg()), contract, height);
            receiver.tokens.forEach(item => {
                if (tokens.hasOwnProperty(item.token_id)) {
                    tokens[item.token_id] = tokens[item.token_id] + item.amount();
                } else {
                    tokens[item.token_id] = item.amount();
                }
                boxBuilder.add_token(wasm.TokenId.from_str(item.token_id), wasm.TokenAmount.from_i64(wasm.I64.from_str(item.amount().toString())));
            });
            candidates.add(boxBuilder.build());
        });
        const addresses = await AddressDbAction.getWalletAddresses(wallet.id);
        const address = (inputAddress ? inputAddress : addresses)[0];
        const coveringBoxes = await BoxDbAction.getCoveringBoxFor(totalRequired, wallet.id, tokens, inputAddress);
        if (coveringBoxes.covered) {
            const tokenSelection = new wasm.Tokens();
            Object.keys(tokens).forEach(token_id => tokenSelection.add(
                new wasm.Token(wasm.TokenId.from_str(token_id), wasm.TokenAmount.from_i64(wasm.I64.from_str(tokens[token_id].toString())))
            ));
            const boxSelector = new wasm.SimpleBoxSelector();
            const selected = boxSelector.select(coveringBoxes.boxes, wasm.BoxValue.from_i64(wasm.I64.from_str(totalRequired.toString())), tokenSelection);
            const tx = wasm.TxBuilder.new(
                selected,
                candidates,
                height,
                this.bigintToBoxValue(FEE),
                wasm.Address.from_base58(address.address),
                this.bigintToBoxValue(FEE)
            ).build();
            return {
                tx: tx,
                boxes: coveringBoxes.boxes
            };
        }
        throw Error("Insufficient erg or token to generate transaction");
    };

    reduceTransaction = async (tx: wasm.UnsignedTransaction, boxes: wasm.ErgoBoxes, data_boxes: wasm.ErgoBoxes, network_type: string) => {
        const ctx = await this.createContext(network_type);
        const reduced_transaction = wasm.ReducedTransaction.from_unsigned_tx(tx, boxes, data_boxes, ctx);
        return reduced_transaction.sigma_serialize_bytes();
    };

    signReduceTransaction = async (txBytes: Uint8Array, dbWallet: Wallet, password: string) => {
        const tx = wasm.ReducedTransaction.sigma_parse_bytes(txBytes);
        const addresses = await AddressDbAction.getWalletAddresses(dbWallet.id);
        const secretKeys = new wasm.SecretKeys();
        for (let addr of addresses) {
            secretKeys.add(await AddressAction.getWalletAddressSecret(dbWallet, password, addr));
        }
        const wallet = wasm.Wallet.from_secrets(secretKeys);
        const signedTx = wallet.sign_reduced_transaction(tx);
        signedTx.to_json();
    };

    signTx = async (dbWallet: Wallet, tx: UnsignedGeneratedTx, password: string) => {
        const addresses = await AddressDbAction.getWalletAddresses(dbWallet.id);
        const secretKeys = new wasm.SecretKeys();
        for (let addr of addresses) {
            secretKeys.add(await AddressAction.getWalletAddressSecret(dbWallet, password, addr));
        }

        const wallet = wasm.Wallet.from_secrets(secretKeys);
        if (tx.tx instanceof wasm.ReducedTransaction) {
            return wallet.sign_reduced_transaction(tx.tx);
        } else {
            const data_inputs = tx.data_inputs ? tx.data_inputs : wasm.ErgoBoxes.from_boxes_json([]);
            return wallet.sign_transaction(await this.createContext(dbWallet.network_type), tx.tx, tx.boxes, data_inputs);
        }
    };


    processResult = async (height: number, dbHeight: number, forkPoint: number, blocks: { [height: number]: string }, network_type: string) => {
        if(dbHeight > forkPoint || dbHeight === 0) {
            try {
                await BoxContentDbAction.forkBoxContents(forkPoint, network_type);
                await BoxDbAction.forkBoxes(height, network_type);
                await TxDbAction.forkTxs(height, network_type);
                await BlockDbAction.forkHeaders(height, network_type);
                await AddressDbAction.setAllAddressHeight(height, network_type);
            } catch (e) {
                return { height: height, blocks: {} };
            }
        }
        await BlockDbAction.InsertHeaders(Object.entries(blocks).map(value => {
            return { id: value[1], height: Number(value[0]) };
        }), network_type);
        return { height: forkPoint, blocks: blocks };
    };

    calcForkPoint = async (height: number, network_type: NetworkType): Promise<{ height: number, blocks: { [height: number]: string } }> => {
        let needProcessBlocks: { [height: number]: string } = {};
        let forkPoint = 0;
        const dbBlocks: { [height: number]: string } = {};
        const dbHeaders = await BlockDbAction.getAllHeaders();
        dbHeaders.forEach(item => dbBlocks[item.height] = item.block_id);
        const dbHeight = Object.keys(dbBlocks).length > 0 ? Math.max(...Object.keys(dbBlocks).map(item => Number(item))) : 0;
        let paging: Paging = { offset: 0, limit: 2 };
        let minHeight: number = height;
        while (minHeight > height - CONFIRMATION_HEIGHT) {
            const chunkHeaders = (await network_type.getExplorer().getBlocksHeaders(paging)).items;
            chunkHeaders.sort((a, b) => b.height - a.height);
            for (let index = 0; index < chunkHeaders.length; index++) {
                const block = chunkHeaders[index];
                minHeight = Math.min(minHeight, block.height);
                if (block.height > height) continue;
                if (dbBlocks.hasOwnProperty(block.height) && dbBlocks[block.height] === block.id) {
                    forkPoint = Math.min(...Object.keys(needProcessBlocks).map(item => Number(item)));
                    return this.processResult(height, dbHeight, forkPoint, needProcessBlocks, network_type.label);
                }
                needProcessBlocks[block.height] = block.id;
            }
            paging.offset += paging.limit;
            paging.limit = Math.min(pageSize, paging.limit + 5);
        }
        return this.processResult(height, dbHeight, forkPoint, needProcessBlocks, network_type.label);
    };

    updateTokenInfo = async (tokenId: string, network_type: string) => {
        const explorer = getNetworkType(network_type).getExplorer()
        const info = await explorer.getFullTokenInfo(tokenId);
        if (info) {
            await AssetDbAction.createOrUpdateAsset(info, network_type);
        }
    };

}

class BlockChainTxActionClass {

    getMinedTxForAddress = async (address: Address) => {
        const blocksList = (await BlockDbAction.getAllHeaders()).map(item => ({id: item.block_id, height: item.height}))
        const blocks = Object.assign({}, ...blocksList.map(item => ({[item.height]: item.id})))
        const explorer = getNetworkType(address.network_type).getExplorer()
        // let txList: Array<ErgoTx> = [];
        const heights = blocksList.map(item => item.height);
        const maxBlockHeight = Math.max(...heights);
        const minBlockHeight = Math.min(...heights);
        let txList: {[height: number]: {[id: string]: ErgoTx}} = {};
        let breakProcess: boolean = false;
        const paging: Paging = {offset: 0, limit: 1}
        const overlapTxId: string = "";
        // fetch all transaction from fromHeight to maxHeight
        while (!breakProcess) {
            let txs = (await explorer.getTxsByAddress(address.address, paging)).items;
            if(overlapTxId) {
                if (txs[0].id !== overlapTxId) {
                    // overlap tx not found. so subtract one index
                    paging.offset -= 1;
                    continue
                } else {
                    txs = txs.slice(1, txs.length)
                }
            }
            for (let tx of txs) {
                if (tx.inclusionHeight > address.tx_load_height) {
                    if (tx.inclusionHeight > maxBlockHeight) continue;
                    if(tx.inclusionHeight >= minBlockHeight && blocks[tx.inclusionHeight] !== tx.blockId) continue;// forked transaction arrived
                    if(!txList.hasOwnProperty(tx.inclusionHeight)){
                        txList[tx.inclusionHeight] = {}
                    }
                    txList[tx.inclusionHeight] = {...txList[tx.inclusionHeight], [tx.id]: tx}
                } else {
                    breakProcess = true;
                    break;
                }
            }
            if (breakProcess || txs.length === 0) {
                break;
            }
            paging.offset += paging.limit - 1; // one overlap tx.
            paging.limit = Math.min(PAGE_SIZE, paging.limit + 10)
        }

        // process heights one by one.
        // for each height first store all tx in database.
        // then store outputs in database
        // then spend tx in database
        // after that move address height one step.
        const txHeights = Object.keys(txList)
        txHeights.sort()
        const storedTxEntity: {[txId: string]: Tx} = {};
        for (let height of txHeights){
            const heightTxList = txList[Number(height)]
            for (let txId of Object.keys(heightTxList)){
                const tx = heightTxList[txId];
                const entity = await TxDbAction.updateOrCreateTx(tx, TxStatus.Mined, address.network_type)
                if(entity && entity.tx) {
                    storedTxEntity[txId] = entity.tx;
                    let index = 0;
                    for (let box of tx.outputs) {
                        if (box.address === address.address) {
                            const boxEntity = await BoxDbAction.createOrUpdateBox(box, address, entity.tx, index);
                            if (boxEntity) {
                                for (let token of box.assets) {
                                    await BoxContentDbAction.createOrUpdateBoxContent(boxEntity, token);
                                }
                            }
                        }
                        index += 0;
                    }
                }else{
                    return
                }
            }
            // now process spending boxes in height
            for(let txId of Object.keys(heightTxList)) {
                const txJson = heightTxList[txId]
                const tx = storedTxEntity[txId];
                let index = 0;
                for (let input of txJson.inputs) {
                    if (input.address === address.address) {
                        await BoxDbAction.spentBox(input.boxId, tx, index);
                    }
                    index += 1;
                }
            }
            await AddressDbAction.setAddressHeight(address.id, Number(height), "tx_load");
        }
        console.log(`address proceed completely ${address.address}`)
    };

    processAddressOutputBoxes = async (address: Address, height: number, txs: Array<TxWithJson>) => {
        for(let tx of txs) {
            let index = 0;
            const txJson: ErgoTx = tx.jsonBi;
            for (let box of txJson.outputs) {
                if (box.address === address.address) {
                    const boxEntity = await BoxDbAction.createOrUpdateBox(box, address, tx, index);
                    if (boxEntity) {
                        for (let token of box.assets) {
                            await BoxContentDbAction.createOrUpdateBoxContent(boxEntity, token);
                        }
                    }
                }
                index += 0;
            }
        }
        await AddressDbAction.setAddressHeight(address.id, height, 'tx_create_box')
    }

    processAddressInputBoxes = async (address: Address, height: number, txs: Array<TxWithJson>) => {
        for(let tx of txs) {
            let index = 0;
            const txJson: ErgoTx = tx.jsonBi;
            for (let input of txJson.inputs) {
                if (input.address === address.address) {
                    await BoxDbAction.spentBox(input.boxId, tx, index);
                }
                index += 1;
            }
        }
        await AddressDbAction.setAddressHeight(address.id, height, 'tx_spent_box')
    }
}

const BlockChainAction = new BlockChainActionClass();
const BlockChainTxAction = new BlockChainTxActionClass();

export {
    Receiver,
    ReceiverToken,
    BlockChainAction,
    BlockChainTxAction,
};
