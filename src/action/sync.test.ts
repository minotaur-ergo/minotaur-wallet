import "@testing-library/jest-dom/extend-expect";
import axios, { AxiosPromise } from "axios";
import * as syncFunctions from './sync.js';
import {stepForward} from './sync.js';



/**
 * Test: blocks fetched correctly and inserted in db.
 * Result: failed.
 * Reason : functions is not implemented yet.
 */
jest.mock('axios');
test('insert blocks to database',async() => {
    const spyInsertToDB = jest.spyOn(syncFunctions, 'insertToDB')
    const block = {
        id : '504',
        height : 3
    };
    (axios.get as jest.Mock).mockResolvedValueOnce(block);
    const result = await stepForward();
    expect(spyInsertToDB).toHaveBeenCalledWith(block);
})

