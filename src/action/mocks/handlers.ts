// src/mocks.js
import { setupWorker, rest } from 'msw';
import { HeightRange } from '../Types';
import { fakeBlockChain } from '../sync/testData';
import { NETWORK_TYPES } from '../../util/network_type';

const BASE_NODE_URL = `http://213.239.193.208:9052`; // Testnet
export const handlers = [
  rest.get(`${BASE_NODE_URL}/blocks/chainSlice`, (req, res, ctx) => {
    const index = req.url.searchParams.get('fromHeight');
    if (index !== null)
      return res(
        ctx.status(200),
        ctx.json([fakeBlockChain.getBlockByIndex(Number(index)).id])
      );
  }),

  rest.get(`${BASE_NODE_URL}/info`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(fakeBlockChain.getLastBlock().height));
  }),

  rest.get(`${BASE_NODE_URL}/blocks`, (req, res, ctx) => {
    const offset = req.url.searchParams.get('offset');
    const limit = req.url.searchParams.get('limit');
    return res(ctx.status(200), ctx.json(fakeBlockChain.getLastBlock));
  }),
];
