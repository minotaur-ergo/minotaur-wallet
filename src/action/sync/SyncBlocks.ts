import { BlockDbAction } from '../db';
import { getNetworkType } from '../../util/network_type';
import { Node } from '../../util/network/node';
import { Block } from '../Types';
import { Paging } from '../../util/network/paging';

//constants
const LIMIT = 50;
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
   * insert array of block headers into databse.
   * @param blocks : Block[]
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

  /**
   * compare overlapBlocks with 2 lastRecievedBlocks, update their overlap and remove intersections from recievedBlocks.
   * @param overlapBlocks : Block[]
   * @param recievedBlocks : Block[]
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

  /**
   * create array of blocks by given IDs and computed heights.
   * @param recievedIDs : string[]
   * @param current_height : number
   * @returns Block[]
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

  /**
   * set paging used in request headers.
   * @param current_height : number
   * @param last_height : number
   * @param limit : number
   * @returns constructed paging : Paging
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

  /**
   * step forward and get all block headers with height >= currentHeight
   * @param currentBlock: Block
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
   * @param currentHeight : number
   */
  update = async (currentHeight: number): Promise<void> => {
    const currentBlock = {
      height: currentHeight,
      id: await this.node.getBlockIdAtHeight(currentHeight),
    };
    if (await this.checkFork(currentBlock)) {
      const forkPoint = await this.calcFork(currentBlock);
      this.removeFromDB(forkPoint);
    } else this.stepForward(currentBlock);
  };
}
