import { test, vi, expect } from 'vitest';

import { SyncAddress } from './sync';
import { Block, TxDictionary, Err } from '../Types';
import * as fs from 'fs';
import { ErgoTx } from '../../util/network/models';
import {
  fakeBlockChain,
  fakeTxs,
  testAddress,
  testNetworkType,
  walletId,
} from './testData';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbJson: Block[] = JSON.parse(db);
const lastLoadedBlock: Block = dbJson[dbJson.length - 1];

export const TestSync = new SyncAddress(walletId, testAddress, testNetworkType);

/**
 * testing stepforward function to insert given blocks correctly in local db.
 * Dependancy: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call stepForward function.
 * Expected: insertToDB function must be called once with determined block.
 */
// test('stepForward process -> insert blocks to database', async () => {
//   fakeBlockChain.setForked(false);
//   const spyInsertToDB = vi.spyOn(TestSync, 'insertBlockToDB');
//   const currentBlock = dbJson[dbJson.length - 1];
//   await TestSync.stepForward(currentBlock);
//   expect(spyInsertToDB).toHaveBeenCalledWith([]);
// });

/**
 * testing stepforward function to insert given blocks correctly in local db.
 * Dependancy: axois mocked.
 * Scenario: same as above but in forked blockChain.
 * Expected: insertToDB function must be called once with determined block.
 */
test('stepForward process -> not insert blocks to database (fork)', async () => {
  fakeBlockChain.setForked(true);
  const spyInsertToDB = vi.spyOn(TestSync, 'insertBlockToDB');
  const currentBlock = dbJson[dbJson.length - 1];
  await TestSync.stepForward(currentBlock);
  expect(spyInsertToDB).not.toHaveBeenCalled();
});

/**
 * testing createBlockArrayByID function to build an array of blocks with given IDs and correct heights.
 * Dependancy: -
 * Scenario: Create a sample array of 2 ID-strings and assume the current height is 0.
 * Expected: createBlockArrayByID function must return array of two blocks with given IDs and heights 1 and 2 respectively.
 */
test('create array of blocks with given IDs', () => {
  const IDs: string[] = ['123', '190'];
  const expectedBlocks: Block[] = [
    {
      id: IDs[0],
      height: 1,
    },
    {
      id: IDs[1],
      height: 2,
    },
  ];
  expect(TestSync.createBlockArrayByID(IDs, 0)).toStrictEqual(expectedBlocks);
});

/**
 * testing checkOverlaps funcstion to
 * Dependancy: -
 * Scenario: fork happened! so overlapBlocks has no overlap with new received Block headers;
 * Expected: throw error.
 */
test('check overlapBlocks (fork happened).', () => {
  const overlapBlocks: Block[] = dbJson.slice(-2);
  const receivedBlocks: Block[] = [
    { ...lastLoadedBlock, id: lastLoadedBlock.id.concat('1') },
  ];
  expect(() => {
    TestSync.checkOverlaps(overlapBlocks, receivedBlocks);
  }).toThrow();
});

/**
 * testing checkOverlaps funcstion in normal situation.
 * Dependancy: -
 * Scenario:
 * Expected: not throw any error and update arrays correctly.
 */
test('check overlapBlocks (normal situation).', () => {
  const newBlock: Block = {
    height: 4,
    id: '430',
  };
  const overlapBlocks: Block[] = dbJson.slice(-2);
  const receivedBlocks: Block[] = [lastLoadedBlock, newBlock];
  const copyReceivedBlocks: Block[] = receivedBlocks.slice(-2);
  TestSync.checkOverlaps(overlapBlocks, receivedBlocks);

  expect(overlapBlocks).toEqual(copyReceivedBlocks);
  expect(receivedBlocks).toEqual([newBlock]);
});

/**
 * testing syncBlocks to call removeFromDB function in case of fork and remove forked blocks from db.
 * Dependancy: -
 * Scenario: checkFork function returns true => fork happened.
 *           stepBackward function returns the receivedBlock as the fork point.
 *           then removeFromDB is called and remove forked blocks from db.
 * Expected: blocks with height greater than receivedBlock have to be removed.
 */
// test('syncBlocks -> remove blocks from database', async () => {
//   fakeBlockChain.setForked(true);
//   const spyRemovefromDB = vi.spyOn(TestSync, 'removeFromDB');
//   await TestSync.syncBlocks(lastLoadedBlock);
//   expect(spyRemovefromDB).toHaveBeenCalledWith(fakeBlockChain.forkHeight);
// });

/**
 * testing syncBlocks to call stepForward function with current Block
 * Dependancy: -
 * Scenario: fork is not happened.
 * Expected: stepForward in else block must be called.
 */
test('syncBlocks -> stepForward process', async () => {
  fakeBlockChain.setForked(false);
  const spyStepForward = vi.spyOn(TestSync, 'stepForward');
  await TestSync.syncBlocks(lastLoadedBlock);
  expect(spyStepForward).toHaveBeenCalledWith(lastLoadedBlock);
});

/**
 * testing checkFork to detect fork in specified height.
 * Dependancy: axois mocked.
 * Scenario: axios response contains the block which is exactly the same as last loaded block from database.
 * Expected: return false(fork is not happened.)
 */
test('check fork function in normal situation', async () => {
  fakeBlockChain.setForked(false);
  const result = await TestSync.checkFork(lastLoadedBlock);
  expect(result).toStrictEqual(false);
});

/**
 * testing setPaging function used in stepForward function.
 * -
 * Scenario: calcuated offset is reaching lastHeight.
 * Expected: passed.
 */
test('check setPaging function', () => {
  const returnedPaging = TestSync.setPaging(
    0,
    fakeBlockChain.getLastBlock().height,
    6
  );
  const expectedPaging = {
    offset: 0,
    limit: 6,
  };
  expect(returnedPaging).toStrictEqual(expectedPaging);
});

/**
 * testing setPaging function used in stepForward function.
 * -
 * Scenario: limit is small so we don't reach the lastHeight.
 * Expected: passed.
 */
test('check setPaging function', () => {
  const returnedPaging = TestSync.setPaging(
    0,
    fakeBlockChain.getLastBlock().height,
    1
  );
  const expectedPaging = {
    offset: 4,
    limit: 1,
  };
  expect(returnedPaging).toStrictEqual(expectedPaging);
});

/**
 * testing checkFork to detect fork in specified height.
 * Dependancy: axois mocked.
 * Scenario: axios response contains the block which has different id from the last loaded block from database.
 * Expected: return true(fork is happened.)
 */
test('check fork function in case of fork', async () => {
  fakeBlockChain.setForked(true);
  const result = await TestSync.checkFork(lastLoadedBlock);
  expect(result).toStrictEqual(true);
});

/**
 * testing calcFork to find fork point correctly.
 * Dependancy: axois mocked.
 * Scenario: axios reponse set to fork last 2 blocks and return third block correctly.
 * Expected: return len(db) - 3 as fork point's height.
 */
// test('calc fork point function', async () => {
//   const result = await TestSync.calcFork(lastLoadedBlock);
//   expect(result).toStrictEqual(fakeBlockChain.forkHeight);
// });

/**
 * testing checkValidation function in case of invalid trxs.
 * Dependancy: -
 * Scenario: Create a sample trx with different blockId from repective db block and pass it to the function.
 * Expected: checkValidation must throw an error.
 */
// test('check validation of invalid tx', async () => {
//   const expectedError: Err = {
//     massege: 'blockIds not matched.',
//     data: fakeBlockChain.getLastBlock().height,
//   };
//   let thrownError: Err;
//   const txDictionary: TxDictionary = TestSync.sortTxs(fakeTxs.invalidTxs);
//   try {
//     TestSync.checkTrxValidation(txDictionary);
//   } catch (e) {
//     thrownError = e as Err;
//     expect(thrownError).toEqual(expectedError);
//   }
// });

/**
 * testing checkValidation function in case of nvalid trxs.
 * Dependancy: -
 * Scenario: Create a sample trx with same blockId as the repective db block and pass it to the function.
 * Expected: checkValidation must not throw any error.
 */
// test('check validation of valid tx', async () => {
//   const txDictionary = TestSync.sortTxs(fakeTxs.validTxs);
//   expect(() => {
//     TestSync.checkTrxValidation(txDictionary);
//   }).not.toThrow();
// });

/**
 * testing sortTxs function.
 * Dependancy: -
 * Scenario: given array of two random ErgoTxs.
 * Expected: sorted TxDictionary as expected.
 */
test('sort Txs and return a TxDictionary', () => {
  const result = TestSync.sortTxs(fakeTxs.validTxs);
  let keys = fakeTxs.validTxs.map((tx) => tx.inclusionHeight);
  keys = keys.sort();
  keys = keys.filter((item, index) => keys.indexOf(item) === index);
  const expectedResult = keys.map((key) => key.toString());
  expect(Object.keys(result)).toEqual(expectedResult);
});

/**
 * testing insertTrxtoDB function to insert given trxs correctly.
 * Dependancy: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call syncTrxsWithAddress function.
 * Expected: insertTrxToDB function must be called once with determined trx.
 */
// test('insert Trx to db in syncTrxsWithAddress function', async () => {
//   const txDictionary = TestSync.sortTxs(fakeTxs.validTxs);
//   const spySaveTrxToDB = vi.spyOn(TestSync, 'saveTxsToDB');
//   TestSync.syncTrxsWithAddress(
//     testAddress,
//     fakeBlockChain.getLastBlock().height
//   );
//   expect(spySaveTrxToDB).toHaveBeenCalledWith(
//     txDictionary,
//     fakeBlockChain.getLastBlock().height
//   );
// });
