import * as wasm from "ergo-lib-wasm-browser";
import { Node } from "../network/node";
import { Explorer } from "../network/explorer";

export interface NetworkTypeInterface {
    readonly node: string;
    readonly explorer: string;
    readonly explorer_front: string;
    readonly color: string;
    readonly prefix: wasm.NetworkPrefix;
    readonly label: string;
}

class NetworkType implements NetworkTypeInterface{
    readonly color: string;
    readonly explorer: string;
    readonly explorer_front: string;
    readonly node: string;
    readonly prefix: wasm.NetworkPrefix;
    readonly label: string;
    private nodeApi: Node | undefined;
    private explorerApi: Explorer | undefined;

    constructor(node: string, explorer: string, explorer_front: string, prefix: wasm.NetworkPrefix, color: string, label: string) {
        this.color = color;
        this.explorer  = explorer;
        this.explorer_front  = explorer_front;
        this.node = node
        this.prefix = prefix;
        this.label = label
    }

    getNode = () => {
        if(!this.nodeApi){
            this.nodeApi = new Node(this.node)
        }
        return this.nodeApi
    }

    getExplorer = () => {
        if(!this.explorerApi){
            this.explorerApi = new Explorer(this.explorer, this.prefix)
        }
        return this.explorerApi;
    }
}

export {
    NetworkType,
}
