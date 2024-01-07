import axios, { AxiosInstance } from 'axios';
import * as wasm from 'ergo-lib-wasm-browser';
import { BlockHeader, NetworkContext, NodeInfo } from './models';
import { JsonBI } from '../json';
import { Paging } from './paging';

export class Node {
  readonly backend: AxiosInstance;

  constructor(uri: string) {
    this.backend = axios.create({
      baseURL: uri,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  sendTx = async (tx: wasm.Transaction) => {
    const response = await this.backend.post('/transactions', tx.to_json(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { txId: response.data as string };
  };

  getInfo = async () => {
    return this.backend
      .request<NodeInfo>({
        url: `/info`,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response) => response.data as NodeInfo);
  };

  getHeight = async () => {
    return this.getInfo()
      .then((res) => res.fullHeight)
      .catch(() => 0);
  };

  getNetworkContext = async (): Promise<NetworkContext> => {
    const height = await this.getHeight();
    const fromHeight = height - 12;
    const toHeight = height + 1;
    return this.backend
      .request<Array<BlockHeader>>({
        url: `/blocks/chainSlice?fromHeight=${fromHeight}&toHeight=${toHeight}`,
      })
      .then((res) => {
        res.data.reverse();
        const headers = res.data.slice(0, 10);
        return {
          height: headers[0].height,
          lastBlockId: headers[0].id,
          lastBlocks: headers,
        };
      });
  };

  /*
    node api to get block header ids between specified heights.
    @param paging : Paging
    @return received headers Promise<Block[]>
    */
  getBlockHeaders = async (paging: Paging): Promise<string[]> => {
    return this.backend
      .request<string[]>({
        url: `/blocks?limit=${paging.limit}&offset=${paging.offset}`,
      })
      .then((res) => {
        return res.data;
      });
  };

  /**
   * node api to get block header id at given height.
   * @param height : number
   * @returns header id: Promise<string>
   */
  getBlockIdAtHeight = async (height: number): Promise<string> => {
    return this.backend
      .request<Array<{ id: string }>>({
        url: `/blocks/chainSlice?fromHeight=${height}&toHeight=${height}`,
      })
      .then((ids) => {
        return ids.data[0].id;
      });
  };

  getLastBlockHeader = async () => {
    return this.backend
      .request<Array<BlockHeader>>({
        url: `/blocks/lastHeaders/${1}`,
      })
      .then((res) => {
        const headers = res.data;
        return {
          height: headers[0].height,
          id: headers[0].id,
        };
      });
  };
}
