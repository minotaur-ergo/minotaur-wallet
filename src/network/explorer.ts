import axios, { AxiosInstance } from "axios";
import { ErgoBox, ErgoTx, HeadersBlockExplorer, Items, TokenInfo } from "./models";
import { Paging } from "./paging";
import * as wasm from 'ergo-lib-wasm-browser';
import { JsonBI } from "../config/json";
import { getNetworkType } from "../config/network_type";

export class Explorer {
    readonly backend: AxiosInstance;

    constructor(uri: string) {
        this.backend = axios.create({
            baseURL: uri,
            timeout: 5000,
            headers: { "Content-Type": "application/json" }
        });
    }

    getTxsByAddress = async (address: string, paging: Paging) => {
        return await this.backend.request<Items<ErgoTx>>({
            url: `/api/v1/addresses/${address}/transactions`,
            params: paging,
            transformResponse: data => JsonBI.parse(data)
        }).then(response => {
            return response.data as Items<ErgoTx>;
        });
    };

    getUTxsByAddress = async (address: string, paging: Paging) => {
        return this.backend.request<Items<ErgoTx>>({
            url: `/api/v1/mempool/transactions/byAddress/${address}`,
            params: paging,
            transformResponse: data => JsonBI.parse(data)
        }).then(response => response.data as Items<ErgoTx>);
    };

    getBoxById = async (boxId: string) => {
        return this.backend.request<ErgoBox>({
            url: `/api/v1/boxes/${boxId}`,
            transformResponse: data => JsonBI.parse(data)
        }).then(response => response.data as ErgoBox);
    }

    getUnspentBoxByTokenId = async (tokenId: string) : Promise<{total: number, items: Array<wasm.ErgoBox>}> => {
        return this.backend.request<Items<ErgoBox>>({
            url: `/api/v1/boxes/unspent/byTokenId/${tokenId}`,
            transformResponse: data => JsonBI.parse(data)
        }).then((response: any) => {
            const converted = response.data.items.map((item: ErgoBox) => wasm.ErgoBox.from_json(JsonBI.stringify(item)))
            return {
                total: response.data.total,
                items: converted
            }
        })
    }
    getBlocksHeaders = async (paging:Paging) => {
        return this.backend
            .request<Items<HeadersBlockExplorer>>({
                url: `api/v1/blocks?offset=${paging.offset}&limit=${paging.limit}`
            }).then(res => res.data)
    }

    getFullTokenInfo = async (tokenId: string): Promise<TokenInfo | undefined> => {
      return this.backend
        .request<TokenInfo>({
          url: `/api/v1/tokens/${tokenId}`,
          transformResponse: data => JsonBI.parse(data),
        }).then(res => (res.status !== 404 ? res.data as TokenInfo : undefined));
    }
}

const getExplorer = (network_type: string) => {
    const networkTypeClass = getNetworkType(network_type)
    return new Explorer(networkTypeClass.explorer);
}

export {
    getExplorer,
}
