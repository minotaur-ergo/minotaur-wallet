import { ErgoTx } from '../../util/network/models';
import { Block } from '../Types';
import * as fs from 'fs';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbBlocks: Block[] = JSON.parse(db);

const lastLoadedBlock: Block = dbBlocks[dbBlocks.length - 1];
class FakeBlockChain {
  blocks: Block[];
  forkedBlocks: Block[];
  transactions: ErgoTx[];
  forked: boolean;
  forkHeight: number;

  constructor() {
    this.blocks = dbBlocks;
    this.forkHeight = 0;
    this.forkedBlocks = this.generateForkedBlockChain();
    this.transactions = [];
    this.forked = false;
  }

  setForked = (forked: boolean) => {
    this.forked = forked;
  };

  getLastBlock = (): Block => {
    return !this.forked
      ? this.blocks.slice(-1)[0]
      : this.forkedBlocks.slice(-1)[0];
  };

  generateFakeBlock = (height: number): Block => {
    return {
      id: this.blocks[height].id.concat('1'),
      height: height,
    };
  };

  generateForkedBlockChain = (): Block[] => {
    const blocks = this.blocks.slice(0, 2);
    blocks.push(this.generateFakeBlock(2));
    blocks.push(this.generateFakeBlock(3));
    this.forkHeight = 1;
    return blocks;
  };

  getBlockByIndex = (index: number) => {
    return !this.forked ? this.blocks[index] : this.forkedBlocks[index];
  };

  getBlockSlice = (offset: number, limit: number) => {
    const reversedBlocks = this.blocks.reverse();
    return reversedBlocks.slice(offset, offset + limit);
  };
}

export const fakeBlockChain = new FakeBlockChain();
