import {
  BlockDbAction,
  TxDbAction,
  AddressDbAction,
  BoxDbAction,
  DbTransaction,
} from '../db';
import { getNetworkType } from '../../util/network_type';
import { Node } from '../../util/network/node';
import { HeightRange, Err, TxDictionary } from '../Types';
import { Paging } from '../../util/network/paging';
import Address from '../../db/entities/Address';
import { ErgoTx, ErgoBox, InputBox } from '../../util/network/models';
import { Items } from '../../util/network/models';
import Tx from '../../db/entities/Tx';

//constants
const LIMIT = 50;
const INITIAL_LIMIT = 10;

export class SyncTxs {
  private address: Address;
  networkType: string;
  node: Node;

  constructor(address: Address, network_type: string) {
    this.networkType = network_type;
    this.address = address;
    this.node = getNetworkType(network_type).getNode();
  }

  /**
   * insert boxes to the data base.
   * @param boxes : ErgoBox[]
   * @param tx : ErgoTx
   */
  insertBoxesToDB = async (boxes: ErgoBox[], tx: ErgoTx): Promise<void> => {
    const trx: Tx | null = await TxDbAction.getTxByTxId(
      tx.id,
      this.networkType
    );
    if (trx != null) {
      for (const box of boxes)
        await BoxDbAction.createOrUpdateBox(box, this.address, trx, box.index);
    } else {
      throw new Error('Transaction not found.');
    }
  };

  /**
   * spend input boxes of given transaction in db.
   * @param boxes : InputBox[]
   * @param tx : ErgoTx
   */
  spendBoxes = async (boxes: InputBox[], tx: ErgoTx) => {
    const trx: Tx | null = await TxDbAction.getTxByTxId(
      tx.id,
      this.networkType
    );
    if (trx != null) {
      for (const box of boxes)
        await BoxDbAction.spentBox(box.boxId, trx, box.index);
    } else {
      throw new Error('Transaction not found.');
    }
  };

  /**
   * save extracted trxs to db, insert unspent boxes and update spent boxes.
   * @param txs : TxDictionary
   * @param maxHeight : number
   */
  saveTxsToDB = async (txs: TxDictionary, maxHeight: number): Promise<void> => {
    const keyHeights = Object.keys(txs).map(Number);
    keyHeights.sort((k1, k2) => k1 - k2);

    for (const height of keyHeights) {
      if (height < maxHeight) {
        await TxDbAction.insertTxs(txs[height], this.networkType);

        for (const tx of txs[height]) {
          await this.insertBoxesToDB(tx.outputs, tx);
        }

        for (const tx of txs[height]) {
          await this.spendBoxes(tx.inputs, tx);
        }
      }
    }
  };

  /**
   * check blockIds of received trxs and compare them with blckIds stored in database.
   * @param txDictionary: TxDictionary
   */
  checkTrxValidation = async (txDictionary: TxDictionary): Promise<void> => {
    const dbHeaders = await BlockDbAction.getAllHeaders(this.networkType);
    for (const height in txDictionary) {
      txDictionary[height].forEach((txHeader) => {
        const foundHeader = dbHeaders.find(
          (dbHeader) => dbHeader.height == txHeader.inclusionHeight
        );
        if (foundHeader == undefined) return;
        else if (txHeader.blockId != foundHeader.id.toString()) {
          throw {
            message: 'blockIds not matched.',
            data: txHeader.inclusionHeight - 1,
          };
        }
      });
    }
  };

  /**
   * sort ErgoTxs and return a dictionary mapping each number k in txs' heightRange to array of txs with inclusionHeight == k
   * @param txs: ErgoTx[]
   * @returns TxDictionary
   */
  sortTxs = (txs: ErgoTx[]): TxDictionary => {
    const sortedTxs: TxDictionary = {};
    txs.forEach((tx) => {
      if (sortedTxs[tx.inclusionHeight] == undefined) {
        sortedTxs[tx.inclusionHeight] = [tx];
      } else {
        sortedTxs[tx.inclusionHeight] =
          sortedTxs[tx.inclusionHeight].concat(tx);
      }
    });
    return sortedTxs;
  };

  /**
   * fork all txs with height > forkHeight, unspend boxes with spend_height > forkHeight and remove all forked boxes from db.
   * @param forkHeight : number
   */
  forkTxs = async (forkHeight: number) => {
    await DbTransaction.fork(forkHeight + 1, this.networkType);
  };

  /**
   * get transactions for specific address, check if they're valid and store them.
   * @param address : Address
   * @param currentHeight : number
   */
  syncTrxsWithAddress = async (address: Address, currentHeight: number) => {
    const explorer = getNetworkType(address.network_type).getExplorer();
    const lastHeight: number = await this.node.getHeight();
    const heightRange: HeightRange = {
      fromHeight: currentHeight,
      toHeight: currentHeight,
    };
    const paging: Paging = {
      limit: INITIAL_LIMIT,
      offset: 0,
    };
    while (heightRange.fromHeight <= lastHeight) {
      const Txs: ErgoTx[] = [];
      let pageTxs: Items<ErgoTx> | undefined = undefined;
      while (pageTxs == undefined || pageTxs.items.length != 0) {
        pageTxs = await explorer.getTxsByAddressInHeightRange(
          address.address,
          heightRange,
          paging,
          true
        );
        Txs.concat(pageTxs.items);
        paging.offset += paging.limit;
      }

      const sortedTxs = this.sortTxs(Txs);
      try {
        this.checkTrxValidation(sortedTxs);
        await this.saveTxsToDB(sortedTxs, heightRange.toHeight);
        AddressDbAction.setAddressHeight(address.id, heightRange.toHeight);
      } catch (err: unknown) {
        const e = err as Err;
        const ProcessedHeight = e.data;
        await this.saveTxsToDB(sortedTxs, ProcessedHeight);
        AddressDbAction.setAddressHeight(address.id, ProcessedHeight);
        throw new Error('Fork happened.');
      }

      heightRange.fromHeight = heightRange.toHeight;
      heightRange.toHeight = Math.min(lastHeight, heightRange.toHeight + LIMIT);
      paging.offset = 0;
    }
  };
}
