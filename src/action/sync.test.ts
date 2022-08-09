import "@testing-library/jest-dom/extend-expect";
import axios, { AxiosPromise } from "axios";
import * as fs from "fs"
import {stepForward} from './sync.js';

const db = fs.readFileSync(`${__dirname}/db.json`).toString();
const dbJson = JSON.parse(db);

jest.mock('axios')

test('fetch blocks failed',async() => {
    const expectedBlocks: any = dbJson;
    jest.fn().mockReturnValueOnce(() => Promise.resolve(expectedBlocks));
    const result = await stepForward();
    expect(result).toBe(expectedBlocks);
})

