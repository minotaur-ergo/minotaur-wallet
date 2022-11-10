import { BlockDbAction } from '../db';
import { getNetworkType } from '../../util/network_type';
import { Node } from '../../util/network/node';
import { Block } from '../Types';

//constants
const LIMIT = 100;
const INITIAL_LIMIT = 10;
const DB_HEIGHT_RANGE = 720;

export class SyncBlocks {
  private networkType: string;
  private node: Node;

  constructor(network_type: string) {
    this.networkType = network_type;
    this.node = getNetworkType(network_type).getNode();
  }

  /**
   * insert array of block headers into database.
   * @param blocks : Block[]
   */
  insertBlockToDB = async (blocks: Block[]): Promise<void> => {
    await BlockDbAction.InsertHeaders(blocks, this.networkType);
  };

  /**
   * compare overlapBlocks with 2 lastReceivedBlocks, update their overlap and remove intersections from receivedBlocks.
   * @param overlapBlocks : Block[]
   * @param receivedBlocks : Block[]
   */
  checkOverlaps = (overlapBlocks: Block[], receivedBlocks: Block[]): void => {
    const latestOverlap = overlapBlocks[overlapBlocks.length - 1];
    const sliceIndex = receivedBlocks.findIndex(
      (item) =>
        item.id === latestOverlap.id && item.height === latestOverlap.height
    );
    if (sliceIndex === -1) throw new Error('overlaps not matched.');
    else {
      const newOverlaps = receivedBlocks.slice(-2);
      receivedBlocks.splice(0, sliceIndex + 1);
      for (let index = 0; index < newOverlaps.length; index++) {
        overlapBlocks[index] = newOverlaps[index];
      }
    }
  };

  /**
   * step forward and get all block headers with height >= currentHeight
   * @param currentBlock: Block
   */
  stepForward = async (currentBlock: Block): Promise<void> => {
    let limit: number = INITIAL_LIMIT;

    const last_height: number = await this.node.getHeight();
    let current_height: number = Math.max(
      currentBlock.height,
      last_height - DB_HEIGHT_RANGE
    );
    let checkOverlap = currentBlock.height >= last_height - DB_HEIGHT_RANGE;
    const overlapBlocks: Block[] = [currentBlock];
    while (last_height - current_height > 0) {
      const paging = {
        offset: current_height - 2, // Two block used for overlaps
        limit: limit,
      };
      const receivedIDs: string[] = await this.node.getBlockHeaders(paging);
      limit = LIMIT;
      const receivedBlocks: Block[] = receivedIDs.map((item, index) => ({
        height: index + paging.offset,
        id: item,
      }));
      try {
        if (checkOverlap) {
          this.checkOverlaps(overlapBlocks, receivedBlocks);
        }
      } catch {
        return;
      }
      await this.insertBlockToDB(receivedBlocks);
      current_height = paging.offset + receivedIDs.length;
      checkOverlap = true;
    }
  };

  /**
   * step backward and compare loaded blocks from db and recieved blocks from node, until reach fork point.
   * @param currentBlock
   * @returns forkPOint height : number
   */
  calcFork = async (currentBlock: Block): Promise<number> => {
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
   * start from last dbBlock(if there is not such a block insert block with height 0.)
   * if fork is happened, return forkHeight
   * otherwise start stepForward process.
   * @returns in case of fork: forkHeight. otherwise undefined
   */
  update = async (): Promise<undefined | number> => {
    let currentBlock = (await BlockDbAction.getLastHeaders(1))?.pop();
    if (!currentBlock) {
      currentBlock = {
        id: await this.node.getBlockIdAtHeight(1),
        height: 1,
      };
      await this.insertBlockToDB([currentBlock]);
    }
    if (await this.checkFork(currentBlock)) {
      return await this.calcFork(currentBlock);
    } else {
      await this.stepForward(currentBlock);
    }
  };
}
