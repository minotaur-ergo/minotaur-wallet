// src/mocks.js
import { setupWorker, rest } from 'msw';
import { HeightRange } from '../Types';
import { fakeBlockChain } from '../sync/testData';
import { NETWORK_TYPES } from '../../util/network_type';

export const handlers = [
  rest.get(`http://213.239.193.208:9052/blocks/chainSlice`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([fakeBlockChain.getLastBlock().id]));
  }),
];
