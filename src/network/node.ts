import axios, { AxiosInstance } from "axios";
import { NODE_URL } from "../config/const";
import * as wasm from "ergo-lib-wasm-browser";
import { BlockHeader, NetworkContext, NodeInfo } from "./models";
import { JsonBI } from "../config/json";


export class Node {
    readonly backend: AxiosInstance;

    constructor(uri: string) {
        this.backend = axios.create({
            baseURL: uri,
            timeout: 5000,
            headers: { "Content-Type": "application/json" }
        });
    }

    sendTx = async (tx: wasm.Transaction) => {
        const response = await this.backend.post("/transactions", JSON.parse(tx.to_json()));
        return { "txId": response.data as string };
    };

    getInfo = async () => {
        return this.backend.request<NodeInfo>({
            url: `/info`,
            transformResponse: data => JsonBI.parse(data)
        }).then(response => response.data as NodeInfo);

    };

    getHeight = async () => {
        return this.getInfo().then(res => res.fullHeight)
    }

    getNetworkContext = async (): Promise<NetworkContext> => {
        const height = await this.getHeight();
        const fromHeight = height - 12;
        const toHeight = height + 1
        return this.backend.request<Array<BlockHeader>>({
            url: `/blocks/chainSlice?fromHeight=${fromHeight}&toHeight=${toHeight}`
        }).then(res => {
            res.data.reverse();
            const headers = res.data.slice(0, 10);
            return {
                height: headers[0].height,
                lastBlockId: headers[0].id,
                lastBlocks: headers
            };
        });
    };

}


const node = new Node(NODE_URL);

export default node;
