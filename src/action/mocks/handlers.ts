// src/mocks.js
import { setupWorker, rest } from 'msw';
import { HeightRange } from '../Types';
import {
  fakeBlockChain,
  fakeTxs,
  testAddress,
  testNetworkType,
  walletId,
} from '../sync/testData';
import { NodeInfo } from '../../util/network/models';

const BASE_NODE_URL = `http://213.239.193.208:9052`; // Testnet Node
const BASE_EXPLORER_URL = `https://testnet.ergoplatform.com`; //Testnet Explorer

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
    const info: NodeInfo = {
      fullHeight: fakeBlockChain.getLastBlock().height,
      headersHeight: fakeBlockChain.getLastBlock().height,
    };
    return res(ctx.status(200), ctx.json(info));
  }),

  rest.get(
    `${BASE_EXPLORER_URL}/api/v1/addresses/${testAddress.id}/transactions`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(fakeBlockChain.forked ? fakeTxs.invalidTxs : fakeTxs.validTxs)
      );
    }
  ),
];
