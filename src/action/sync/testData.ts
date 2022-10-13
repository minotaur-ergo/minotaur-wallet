import { ErgoTx } from '../../util/network/models';
import { Block } from '../Types';
import * as fs from 'fs';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbBlocks: Block[] = JSON.parse(db);

const lastLoadedBlock: Block = dbBlocks[dbBlocks.length - 1];
class FakeBlockChain {
  blocks: Block[];
  transactions: ErgoTx[];
  forked: boolean;

  constructor() {
    this.blocks = dbBlocks;
    this.transactions = [];
    this.forked = false;
  }

  setForked = (forked: boolean) => {
    this.forked = forked;
  };

  getLastBlock = (): Block => {
    return !this.forked ? this.blocks.slice(-1)[0] : this.generateFakeBlock();
  };

  generateFakeBlock = () => {
    const block = this.blocks.slice(-1)[0];
    return { ...block, id: block.id.concat('1') };
  };
}
export const fakeBlockChain = new FakeBlockChain();
