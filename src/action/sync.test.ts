import "@testing-library/jest-dom/extend-expect";
import axios, { AxiosPromise } from "axios";
import * as syncFunctions from './sync.js';
import {stepForward} from './sync.js';



jest.mock('axios');
/**
 * testing stepforward function to insert given blocks correctly in local db.
 * Dependancy: axois mocked.
 * Scenario: Create a sample response and make mocked axios instance return it, then call stepForward function.
 * Expected: insertToDB function must be called once with determined block.
 */
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

