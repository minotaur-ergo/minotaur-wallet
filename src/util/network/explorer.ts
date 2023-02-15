import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AddressInfo,
  ErgoBox,
  ErgoTx,
  HeadersBlockExplorer,
  Items,
  TokenInfo,
} from './models';
import { HeightPage, Paging } from './paging';
import * as wasm from 'ergo-lib-wasm-browser';
import { JsonAllBI, JsonBI } from '../json';

export class Explorer {
  readonly backend: AxiosInstance;
  readonly network_prefix: wasm.NetworkPrefix;

  constructor(uri: string, prefix: wasm.NetworkPrefix) {
    this.network_prefix = prefix;
    this.backend = axios.create({
      baseURL: uri,
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getTxsByAddress = async (address: string, paging: Paging) => {
    return await this.backend
      .request<Items<ErgoTx>>({
        url: `/api/v1/addresses/${address}/transactions`,
        params: paging,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response) => {
        return response.data as Items<ErgoTx>;
      });
  };

  /**
   * get transactions for given address between given height blocks.
   * @param address : string
   * @param heightRange : HeightRange
   * @param paging
   * @param conciseEnabled : Boolean
   * @returns Promise<Items<ErgoTx>>
   */
  getTxsByAddressInHeightRange = async (
    address: string,
    heightRange: HeightPage,
    paging: Paging,
    conciseEnabled: boolean
  ): Promise<Items<ErgoTx>> => {
    return await this.backend
      .request<Items<ErgoTx>>({
        url: `/api/v1/addresses/${address}/transactions`,
        params: { ...heightRange, ...paging, concise: conciseEnabled },
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response) => {
        return response.data as Items<ErgoTx>;
      });
  };

  getUTxsByAddress = async (address: string, paging: Paging) => {
    return this.backend
      .request<Items<ErgoTx>>({
        url: `/api/v1/mempool/transactions/byAddress/${address}`,
        params: paging,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response) => response.data as Items<ErgoTx>);
  };

  getBoxById = async (boxId: string) => {
    return this.backend
      .request<ErgoBox>({
        url: `/api/v1/boxes/${boxId}`,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response) => response.data as ErgoBox);
  };

  getUnspentBoxByTokenId = async (
    tokenId: string
  ): Promise<{ total: number; items: Array<wasm.ErgoBox> }> => {
    return this.backend
      .request<Items<ErgoBox>>({
        url: `/api/v1/boxes/unspent/byTokenId/${tokenId}`,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((response: AxiosResponse<Items<ErgoBox>>) => {
        const converted = response.data.items.map((item: ErgoBox) =>
          wasm.ErgoBox.from_json(JsonBI.stringify(item))
        );
        return {
          total: response.data.total,
          items: converted,
        };
      });
  };

  getBlocksHeaders = async (paging: Paging) => {
    return this.backend
      .request<Items<HeadersBlockExplorer>>({
        url: `api/v1/blocks?offset=${paging.offset}&limit=${paging.limit}`,
      })
      .then((res) => res.data);
  };

  getFullTokenInfo = async (
    tokenId: string
  ): Promise<TokenInfo | undefined> => {
    return this.backend
      .request<TokenInfo>({
        url: `/api/v1/tokens/${tokenId}`,
        transformResponse: (data) => JsonBI.parse(data),
      })
      .then((res) =>
        res.status !== 404 ? (res.data as TokenInfo) : undefined
      );
  };

  getMemPoolTxForAddress = async (address: string) => {
    return await this.backend
      .get<{ items: Array<ErgoTx>; total: number }>(
        `/api/v1/mempool/transactions/byAddress/${address}`
      )
      .then((res) => res.data);
  };

  trackMemPool = async (box: wasm.ErgoBox) => {
    const address: string = wasm.Address.recreate_from_ergo_tree(
      box.ergo_tree()
    ).to_base58(this.network_prefix);
    const memPoolBoxesMap = new Map<string, wasm.ErgoBox>();
    (
      await this.getMemPoolTxForAddress(address).then((res) => {
        return res.items;
      })
    ).forEach((tx: ErgoTx) => {
      for (const inBox of tx.inputs) {
        if (inBox.address === address) {
          for (const outBox of tx.outputs) {
            if (outBox.address === address) {
              memPoolBoxesMap.set(
                inBox.boxId,
                wasm.ErgoBox.from_json(JSON.stringify(outBox))
              );
              break;
            }
          }
          break;
        }
      }
    });
    let lastBox: wasm.ErgoBox = box;
    let tracked = memPoolBoxesMap.get(lastBox.box_id().to_str());
    while (tracked) {
      lastBox = tracked;
      tracked = memPoolBoxesMap.get(lastBox.box_id().to_str());
    }
    return lastBox;
  };

  getConfirmedBalanceByAddress = async (address: string) => {
    return this.backend
      .request<AddressInfo>({
        url: `/api/v1/addresses/${address}/balance/confirmed`,
        transformResponse: (data) => JsonAllBI.parse(data),
      })
      .then((response) => response.data);
  };
}
