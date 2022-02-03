import axios, { AxiosInstance } from "axios";
import { ErgoBox, ErgoTx, HeadersBlockExplorer, Items, TokenInfo } from "./models";
import { Paging } from "./paging";

import { JsonBI } from "../config/json";
import { EXPLORER_URL } from "../config/const";

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


const explorer = new Explorer(EXPLORER_URL);

export default explorer;
