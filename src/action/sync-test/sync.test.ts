import { test, vi, expect } from 'vitest';

// import { SyncTxs } from '../sync/SyncTxs';
// import { Block } from '../sync/Block';
import { Block } from '../Types';
import * as fs from 'fs';

import {
  fakeBlockChain,
  fakeTxs,
  testAddress,
  testNetworkType,
} from './testData';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbJson: Block[] = JSON.parse(db);
const lastLoadedBlock: Block = dbJson[dbJson.length - 1];

// export const TestSyncTxs = new SyncTxs(testAddress, testNetworkType);
// export const TestSyncBlocks = new Block(testNetworkType);

/**
 * testing stepForward function to insert given blocks correctly in local db.
 * Dependency: axois mocked.
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
 * testing stepForward function to insert given blocks correctly in local db.
 * Dependency: axois mocked.
 * Scenario: same as above but in forked blockChain.
 * Expected: insertToDB function must be called once with determined block.
 */
test('stepForward process -> not insert blocks to database (fork)', async () => {
  // fakeBlockChain.setForked(true);
  // const spyInsertToDB = vi.spyOn(TestSyncBlocks, 'insertBlockToDB');
  // const currentBlock = dbJson[dbJson.length - 1];
  // await TestSyncBlocks.stepForward(currentBlock);
  // expect(spyInsertToDB).not.toHaveBeenCalled();
});

/**
 * testing checkOverlaps function to
 * Dependency: -
 * Scenario: fork happened! so overlapBlocks has no overlap with new received Block headers;
 * Expected: throw error.
 */
test('check overlapBlocks (fork happened).', () => {
  // const overlapBlocks: Block[] = dbJson.slice(-2);
  // const receivedBlocks: Block[] = [
  //   { ...lastLoadedBlock, id: lastLoadedBlock.id.concat('1') },
  // ];
  // expect(() => {
  //   TestSyncBlocks.checkOverlaps(overlapBlocks, receivedBlocks);
  // }).toThrow();
});

/**
 * testing checkOverlaps function in normal situation.
 * Dependency: -
 * Scenario:
 * Expected: not throw any error and update arrays correctly.
 */
test('check overlapBlocks (normal situation).', () => {
  // const newBlock: Block = {
  //   height: 4,
  //   id: '430',
  // };
  // const overlapBlocks: Block[] = dbJson.slice(-2);
  // const receivedBlocks: Block[] = [lastLoadedBlock, newBlock];
  // const copyReceivedBlocks: Block[] = receivedBlocks.slice(-2);
  // TestSyncBlocks.checkOverlaps(overlapBlocks, receivedBlocks);
  //
  // expect(overlapBlocks).toEqual(copyReceivedBlocks);
  // expect(receivedBlocks).toEqual([newBlock]);
});

/**
 * testing syncBlocks to call removeFromDB function in case of fork and remove forked blocks from db.
 * Dependency: -
 * Scenario: checkFork function returns true => fork happened.
 *           stepBackward function returns the receivedBlock as the fork point.
 *           then removeFromDB is called and remove forked blocks from db.
 * Expected: blocks with height greater than receivedBlock have to be removed.
 */
// test('syncBlocks -> remove blocks from database', async () => {
//   fakeBlockChain.setForked(true);
//   const spyRemoveFromDB = vi.spyOn(TestSync, 'removeFromDB');
//   await TestSync.syncBlocks(lastLoadedBlock);
//   expect(spyRemoveFromDB).toHaveBeenCalledWith(fakeBlockChain.forkHeight);
// });

/**
 * testing syncBlocks to call stepForward function with current Block
 * Dependency: -
 * Scenario: fork is not happened.
 * Expected: stepForward in else block must be called.
 */
// test('update function -> stepForward process', async () => {
//   fakeBlockChain.setForked(false);
//   const spyStepForward = vi.spyOn(TestSyncBlocks, 'stepForward');
//   await TestSyncBlocks.update(lastLoadedBlock.height);
//   expect(spyStepForward).toHaveBeenCalledWith(lastLoadedBlock);
// });

/**
 * testing checkFork to detect fork in specified height.
 * Dependency: axois mocked.
 * Scenario: axios response contains the block which is exactly the same as last loaded block from database.
 * Expected: return false(fork is not happened.)
 */
// test('check fork function in normal situation', async () => {
//   fakeBlockChain.setForked(false);
//   const result = await TestSyncBlocks.checkFork(lastLoadedBlock);
//   expect(result).toStrictEqual(false);
// });

/**
 * testing checkFork to detect fork in specified height.
 * Dependency: axois mocked.
 * Scenario: axios response contains the block which has different id from the last loaded block from database.
 * Expected: return true(fork is happened.)
 */
test('check fork function in case of fork', async () => {
  // fakeBlockChain.setForked(true);
  // const result = await TestSyncBlocks.checkFork(lastLoadedBlock);
  // expect(result).toStrictEqual(true);
});

/**
 * testing calcFork to find fork point correctly.
 * Dependency: axois mocked.
 * Scenario: axios response set to fork last 2 blocks and return third block correctly.
 * Expected: return len(db) - 3 as fork point's height.
 */
// test('calc fork point function', async () => {
//   const result = await TestSyncBlocks.calcFork(lastLoadedBlock);
//   expect(result).toStrictEqual(fakeBlockChain.forkHeight);
// });

/**
 * testing checkValidation function in case of invalid txs.
 * Dependency: -
 * Scenario: Create a sample trx with different blockId from respective db block and pass it to the function.
 * Expected: checkValidation must throw an error.
 */
// test('check validation of invalid tx', async () => {
//   const expectedError: Err = {
//     message: 'blockIds not matched.',
//     data: fakeBlockChain.getLastBlock().height,
//   };
//   let thrownError: Err;
//   const txDictionary: TxDictionary = TestSyncTxs.sortTxs(fakeTxs.invalidTxs);
//   try {
//     TestSyncTxs.checkTrxValidation(txDictionary);
//   } catch (e) {
//     thrownError = e as Err;
//     expect(thrownError).toEqual(expectedError);
//   }
// });

/**
 * testing checkValidation function in case of invalid txs.
 * Dependency: -
 * Scenario: Create a sample trx with same blockId as the respective db block and pass it to the function.
 * Expected: checkValidation must not throw any error.
 */
// test('check validation of valid tx', async () => {
//   const txDictionary = TestSyncTxs.sortTxs(fakeTxs.validTxs);
//   expect(() => {
//     TestSyncTxs.checkTrxValidation(txDictionary);
//   }).not.toThrow();
// });

/**
 * testing sortTxs function.
 * Dependency: -
 * Scenario: given array of two random ErgoTxs.
 * Expected: sorted TxDictionary as expected.
 */
test('sort Txs and return a TxDictionary', () => {
  // const result = TestSyncTxs.sortTxs(fakeTxs.validTxs);
  // let keys = fakeTxs.validTxs.map((tx) => tx.inclusionHeight);
  // keys = keys.sort();
  // keys = keys.filter((item, index) => keys.indexOf(item) === index);
  // const expectedResult = keys.map((key) => key.toString());
  // expect(Object.keys(result)).toEqual(expectedResult);
});

/**
 * testing insertTxToDB function to insert given txs correctly.
 * Dependency: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call syncTxsWithAddress function.
 * Expected: insertTrxToDB function must be called once with determined trx.
 */
// test('insert Tx to db in syncTxsWithAddress function', async () => {
//   const txDictionary = TestSyncTxs.sortTxs(fakeTxs.validTxs);
//   const spySaveTrxToDB = vi.spyOn(TestSyncTxs, 'saveTxsToDB');
//   TestSyncTxs.syncTxsWithAddress(
//     testAddress,
//     fakeBlockChain.getLastBlock().height
//   );
//   expect(spySaveTrxToDB).toHaveBeenCalledWith(
//     txDictionary,
//     fakeBlockChain.getLastBlock().height
//   );
// });
