import { ErgoTx, ErgoBox } from '../../util/network/models';
import { Block } from '../Types';
import * as fs from 'fs';
import Address from '../../db/entities/Address';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbBlocks: Block[] = JSON.parse(db);

class FakeBlockChain {
  blocks: Block[];
  forkedBlocks: Block[];
  forked: boolean;
  forkHeight: number;

  constructor() {
    this.blocks = dbBlocks;
    this.forkHeight = 0;
    this.forkedBlocks = this.generateForkedBlockChain();
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

class FakeTxs {
  validTxs: ErgoTx[];
  invalidTxs: ErgoTx[];

  constructor() {
    this.validTxs = this.generateValidTxs(4);
    this.invalidTxs = this.generateInvalidTxs(4);
  }

  generateValidTxs = (count: number) => {
    const block = fakeBlockChain.getLastBlock();
    const txs: ErgoTx[] = [];
    while (count--) {
      const testTx = {
        id: this.getRandomId(3),
        blockId: block.id,
        inclusionHeight: block.height,
        inputs: [],
        dataInputs: [],
        outputs: [this.generateErgoBox(block.id)],
        size: 1,
        timestamp: 12,
      };
      txs.push(testTx);
    }
    return txs;
  };

  generateInvalidTxs = (count: number): ErgoTx[] => {
    const block = fakeBlockChain.getLastBlock();
    const txs: ErgoTx[] = [];
    while (count--) {
      const testTx = {
        id: this.getRandomId(3),
        blockId: block.id.concat('1'),
        inclusionHeight: block.height,
        inputs: [],
        dataInputs: [],
        outputs: [this.generateErgoBox(block.id.concat('1'))],
        size: 1,
        timestamp: 12,
      };
      txs.push(testTx);
    }
    return txs;
  };

  generateErgoBox = (blockId: string): ErgoBox => {
    const testErgoBox: ErgoBox = {
      boxId: this.getRandomId(4),
      transactionId: this.getRandomId(3),
      blockId: blockId,
      value: BigInt(1000000000),
      index: 0,
      creationHeight: 0,
      settlementHeight: 0,
      ergoTree: '',
      address: '',
      assets: [],
      additionalRegisters: {},
    };
    return testErgoBox;
  };

  getRandomId(digit: number): string {
    const result = '';
    while (digit--) {
      const randomDigit = Math.floor(Math.random() * 9);
      result.concat(randomDigit.toString());
    }
    return result;
  }
}

const fakeBlockChain = new FakeBlockChain();
const fakeTxs = new FakeTxs();
const testAddress = new Address();
const testNetworkType = 'Testnet';
const walletId = 0;
export { fakeBlockChain, fakeTxs, testAddress, testNetworkType, walletId };
