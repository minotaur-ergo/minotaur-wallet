import * as wasm from 'ergo-lib-wasm-browser';
import { Explorer } from "../network/explorer";
import { Node } from "../network/node";

interface NetworkTypeInterface {
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

const MainNet = new NetworkType(
    "http://213.239.193.208:9053",
    "https://api.ergoplatform.com",
    "https://explorer.ergoplatform.com",
    wasm.NetworkPrefix.Mainnet,
    "primary",
    "Mainnet"
)

const TestNet = new NetworkType(
    "http://213.239.193.208:9052",
    "https://api-testnet.ergoplatform.com",
    "https://testnet.ergoplatform.com",
    wasm.NetworkPrefix.Testnet,
    "danger",
    "Testnet"
)

const Local = new NetworkType(
    "http://10.10.9.3:9064",
    "http://10.10.9.3:7000",
    "http://10.10.9.3:5000",
    wasm.NetworkPrefix.Mainnet,
    "default",
    "Deployment"
)

const NETWORK_TYPES = [
    Local,
    MainNet,
    TestNet,
]

const getNetworkType = (networkName: string): NetworkType => {
    const selected = NETWORK_TYPES.filter(item => item.label === networkName)
    return selected.length > 0 ? selected[0] : NETWORK_TYPES[0]
}

export {
    NETWORK_TYPES,
    getNetworkType,
    NetworkType,
}
