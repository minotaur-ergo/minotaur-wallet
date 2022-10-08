import {
  BlockDbAction,
  TxDbAction,
  AddressDbAction,
  BoxDbAction,
  DbTransaction,
} from './db';
import { getNetworkType } from '../util/network_type';
import { Node } from '../util/network/node';
import { Block, HeightRange, Err, TxDictionary } from './Types';
import { Paging } from '../util/network/paging';
import Address from '../db/entities/Address';
import { ErgoTx, ErgoBox, InputBox } from '../util/network/models';
import { Items } from '../util/network/models';
import Tx from '../db/entities/Tx';

//constants
const LIMIT = 50;
const INITIAL_LIMIT = 10;
const DB_HEIGHT_RANGE = 720;
export class SyncAddress {
  private walletId: number;
  private address: Address;
  networkType: string;
  node: Node;

  constructor(wallet_id: number, address: Address, network_type: string) {
    this.walletId = wallet_id;
    this.networkType = network_type;
    this.address = address;
    this.node = getNetworkType(network_type).getNode();
  }

  /*
        insert array of block headers into databse.
        @param blocks : Block[]
        @param networkType : string
    */
  insertBlockToDB = (blocks: Block[]): void => {
    blocks.forEach((block) => {
      BlockDbAction.InsertHeaders(
        Object.entries(block).map((value) => {
          return { id: block.id, height: block.height };
        }),
        this.networkType
      );
    });
  };

  /*
        compare overlapBlocks with 2 lastRecievedBlocks, update their overlap and remove intersections from recievedBlocks.
        @param overlapBlock : Block[]
        @param lastRecievedBlock : Block
    */
  checkOverlaps = (overlapBlocks: Block[], recievedBlocks: Block[]): void => {
    const sliceIndex = recievedBlocks.indexOf(overlapBlocks[1]);
    if (sliceIndex === -1) throw new Error('overlaps not matched.');
    else {
      const newOverlaps = recievedBlocks.slice(-2);
      recievedBlocks.splice(0, sliceIndex + 1);
      for (let index = 0; index < newOverlaps.length; index++) {
        overlapBlocks[index] = newOverlaps[index];
      }
    }
  };

  /*
        create array of blocks by given IDs and computed heights.
        @param recievedIDs : string[]
        @param current_height : number
        @return Block[]
    */
  createBlockArrayByID = (
    recievedIDs: string[],
    current_height: number
  ): Block[] => {
    current_height++;
    return recievedIDs.map((id, index) => {
      return {
        id: id,
        height: current_height + index,
      };
    });
  };

  /*
        set paging used in request headers.
        @param current_height : number 
        @param last_height : number
        @return constructed paging : Paging
    */
  setPaging = (
    current_height: number,
    last_height: number,
    limit: number
  ): Paging => {
    const current_offset = last_height - current_height;
    return {
      offset: Math.max(current_offset - limit + 2, 0),
      limit: limit,
    };
  };

  /*
        step forward and get all block headers after current height
        @param currentBlock : Block
        @param networkType: string
    */
  stepForward = async (currentBlock: Block): Promise<void> => {
    let paging: Paging;
    let limit: number = INITIAL_LIMIT;

    let current_height: number = currentBlock.height;
    const last_height: number = await this.node.getHeight();

    const overlapBlocks: Block[] = [currentBlock];

    while (last_height - current_height > 0) {
      paging = this.setPaging(current_height, last_height, limit);
      const recievedIDs: string[] = await this.node.getBlockHeaders(paging);
      limit = LIMIT;

      const recievedBlocks: Block[] = this.createBlockArrayByID(
        recievedIDs,
        current_height
      );
      this.checkOverlaps(overlapBlocks, recievedBlocks);
      this.insertBlockToDB(recievedBlocks);
      current_height += paging.limit;
    }
  };

  /**
   * remove blocks with height > forkheight from db.
   * @param forkHeight : number
   */
  removeFromDB = (forkHeight: number): void => {
    BlockDbAction.forkHeaders(forkHeight + 1, this.networkType);
  };

  /**
   * step backward and compare loaded blocks from db and recieved blocks from node, until reach fork point.
   * @param currentBlock
   * @returns forkPOint height : number
   */
  calcFork = async (currentBlock: Block): Promise<number> => {
    console.log(this.node);
    let forkPoint = -1;
    let currHeight = currentBlock.height;

    const loadedBlocks = await BlockDbAction.getAllHeaders(this.networkType);
    while (forkPoint == -1) {
      const receivedID: string = await this.node.getBlockIdAtHeight(currHeight);
      forkPoint = receivedID == loadedBlocks[0].block_id ? currHeight : -1;
      loadedBlocks.shift();
      currHeight--;
    }
    return forkPoint;
  };

  /**
   * compare current block id with block id given from node api in same height.
   * @param currentBlock : Block
   * @returns fork happened or not : Promise<Boolean>
   */
  checkFork = async (currentBlock: Block): Promise<boolean> => {
    const receivedID: string = await this.node.getBlockIdAtHeight(
      currentBlock.height
    );
    return currentBlock.id != receivedID;
  };

  /**
   * if case of fork stepBackward to find fork point and remove all forked blocks from db; else step forward.
   * @param currentBlock : Block
   */
  syncBlocks = async (currentBlock: Block): Promise<void> => {
    if (await this.checkFork(currentBlock)) {
      const forkPoint = await this.calcFork(currentBlock);
      this.removeFromDB(forkPoint);
    } else this.stepForward(currentBlock);
  };

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
    while (heightRange.fromHeight < lastHeight) {
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

/**
 * sync transactions and store in db for all addresses of the walletId.
 * @param walletId : number
 */
export const syncTrxs = async (walletId: number) => {
  const allAddresses = await AddressDbAction.getWalletAddresses(walletId);
  allAddresses.forEach(async (address) => {
    const currentHeight = address.process_height;
    const networkType = address.network_type;
    const Sync = new SyncAddress(walletId, address, networkType);
    await Sync.syncTrxsWithAddress(address, currentHeight);
  });
};
