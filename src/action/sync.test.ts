import { test, vi, expect } from 'vitest';

import axios from 'axios';
import { SyncAddress } from './sync';
import { Block, TxDictionary } from './Types';
import * as fs from 'fs';
import Address from '../db/entities/Address';
import { ErgoTx } from '../util/network/models';

//test values
const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbJson: Block[] = JSON.parse(db);

const lastLoadedBlock: Block = dbJson[dbJson.length - 1];
const testAddress = new Address();
const testNetworkType = 'Testnet';
const walletId = 0;
const TestSync = new SyncAddress(walletId, testAddress, testNetworkType);

vi.mock('axios');

/**
 * testing stepforward function to insert given blocks correctly in local db.
 * Dependancy: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call stepForward function.
 * Expected: insertToDB function must be called once with determined block.
 */
test('insert blocks to database', async () => {
  const spyInsertToDB = vi.spyOn(TestSync, 'insertToDB');
  const block: Block = {
    id: '504',
    height: 3,
  };
  vi.mocked(axios.get).mockReset();
  vi.mocked(axios.get).mockResolvedValueOnce(block);
  const result = await TestSync.stepForward(lastLoadedBlock);
  expect(spyInsertToDB).toHaveBeenCalledWith([block]);
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
 * testing syncFunction to call removeFromDB function in case of fork and remove forked blocks from db.
 * Dependancy: -
 * Scenario: checkFork function returns true => fork happened.
 *           stepBackward function returns the receivedBlock as the fork point.
 *           then removeFromDB is called and remove forked blocks from db.
 * Expected: blocks with height greater than receivedBlock have to be removed.
 */
test('remove blocks from database', async () => {
  const spyCalcFork = vi.spyOn(TestSync, 'calcFork');
  const spyRemovefromDB = vi.spyOn(TestSync, 'removeFromDB');
  const spyCheckFork = vi.spyOn(TestSync, 'checkFork');

  const lastLoadedBlock: Block = dbJson[dbJson.length - 1];
  const forkPoint: number = dbJson[1].height;

  spyCheckFork.mockReturnValueOnce(Promise.resolve(true));
  spyCalcFork.mockReturnValueOnce(Promise.resolve(forkPoint));
  TestSync.syncBlocks(lastLoadedBlock);
  expect(spyRemovefromDB).toHaveBeenCalledWith(forkPoint);
});

/**
 * testing checkFork to detect fork in specified height.
 * Dependancy: axois mocked.
 * Scenario: axios response contains the block which is exactly the same as last loaded block from database.
 * Expected: return false(fork is not happened.)
 */
test('check fork function in normal situation', async () => {
  const receivedBlock: Block = lastLoadedBlock;
  vi.mocked(axios.get).mockReset();
  vi.mocked(axios.get).mockResolvedValueOnce(receivedBlock);
  expect(TestSync.checkFork(lastLoadedBlock)).toStrictEqual(false);
});

/**
 * testing checkFork to detect fork in specified height.
 * Dependancy: axois mocked.
 * Scenario: axios response contains the block which has different id from the last loaded block from database.
 * Expected: return true(fork is happened.)
 */
test('check fork function in case of fork', async () => {
  const receivedBlock: Block = {
    id: lastLoadedBlock.id.concat('1'),
    height: lastLoadedBlock.height,
  };
  vi.mocked(axios.get).mockReset();
  vi.mocked(axios.get).mockResolvedValueOnce(receivedBlock);
  expect(TestSync.checkFork(lastLoadedBlock)).toStrictEqual(true);
});

/**
 * testing calcFork to find fork point correctly.
 * Dependancy: axois mocked.
 * Scenario: axios reponse set to fork last 2 blocks and return third block correctly.
 * Expected: return len(db) - 3 as fork point's height.
 */
test('calc fork point function', async () => {
  const len = dbJson.length;
  const receivedBlocks: Block[] = dbJson.slice(-2).map((block) => {
    return { ...block, id: block.id.concat('1') };
  });
  vi.mocked(axios.get).mockReset();
  vi.mocked(axios.get).mockResolvedValueOnce(receivedBlocks[1]);
  vi.mocked(axios.get).mockResolvedValueOnce(receivedBlocks[0]);
  vi.mocked(axios.get).mockResolvedValueOnce(dbJson[len - 3]);
  expect(TestSync.calcFork(lastLoadedBlock)).toStrictEqual(
    dbJson[len - 3].height
  );
});

/**
 * testing insertTrxtoDB function to insert given trxs correctly.
 * Dependancy: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call syncTrxsWithAddress function.
 * Expected: insertTrxToDB function must be called once with determined trx.
 */
test('insert Trx to db', async () => {
  const spySaveTrxToDB = vi.spyOn(TestSync, 'saveTxsToDB');
  const spyCheckTrxValidation = vi.spyOn(TestSync, 'checkTrxValidation');
  const receivedTrx: ErgoTx = {
    id: '8189',
    blockId: '111',
    inclusionHeight: 3,
    inputs: [],
    dataInputs: [],
    outputs: [],
    size: 1,
    timestamp: 12,
  };

  vi.mocked(axios.get).mockReset();
  vi.mocked(axios.get).mockResolvedValueOnce(receivedTrx);
  spyCheckTrxValidation.mockImplementationOnce(
    async (trxs: TxDictionary) => { /*empty*/ }
  );
  TestSync.syncTrxsWithAddress(testAddress, receivedTrx.inclusionHeight);
  expect(spySaveTrxToDB).toHaveBeenCalledWith(
    [receivedTrx],
    receivedTrx.inclusionHeight
  );
});

/**
 * testing checkValidation function in case of invalid trxs.
 * Dependancy: -
 * Scenario: Create a sample trx with different blockId from repective db block and pass it to the function.
 * Expected: checkValidation must throw an error.
 */
test('check validation of invalid tx', async () => {
  const height = 3;
  const ID = dbJson[height].id.concat('1');
  const receivedTrx: ErgoTx = {
    id: '8189',
    blockId: ID,
    inclusionHeight: height,
    inputs: [],
    dataInputs: [],
    outputs: [],
    size: 1,
    timestamp: 12,
  };
  const txDictionary: TxDictionary = {};
  txDictionary[receivedTrx.inclusionHeight] = [receivedTrx];
  expect(TestSync.checkTrxValidation(txDictionary)).toThrow(
    'blockIds not matched.'
  );
});

/**
 * testing checkValidation function in case of nvalid trxs.
 * Dependancy: -
 * Scenario: Create a sample trx with same blockId as the repective db block and pass it to the function.
 * Expected: checkValidation must not throw any error.
 */
test('check validation of valid tx', async () => {
  const height = 3;
  const ID = dbJson[height].id;
  const receivedTrx: ErgoTx = {
    id: '8189',
    blockId: ID,
    inclusionHeight: height,
    inputs: [],
    dataInputs: [],
    outputs: [],
    size: 1,
    timestamp: 12,
  };
  const txDictionary: TxDictionary = {};
  txDictionary[receivedTrx.inclusionHeight] = [receivedTrx];
  expect(TestSync.checkTrxValidation(txDictionary)).not.toThrow(
    'blockIds not matched.'
  );
});
