import * as wasm from "ergo-lib-wasm-browser";
import { NetworkType } from "./interface";


const MainNet = new NetworkType(
    "http://213.239.193.208:9053",
    "https://api.ergoplatform.com",
    "https://explorer.ergoplatform.com",
    wasm.NetworkPrefix.Mainnet,
    "purple",
    "Mainnet"
);

const DevNet = new NetworkType(
    "http://10.10.9.3:9065",
    "http://10.10.9.3:7000",
    "http://10.10.9.3:5000",
    wasm.NetworkPrefix.Mainnet,
    "purple",
    "DevNet"
);

const TestNet = new NetworkType(
    "http://213.239.193.208:9052",
    "https://api-testnet.ergoplatform.com",
    "https://testnet.ergoplatform.com",
    wasm.NetworkPrefix.Testnet,
    "orange",
    "Testnet"
);

const NETWORK_TYPES = [
    MainNet,
    TestNet,
    DevNet
];

const getNetworkType = (networkName: string): NetworkType => {
    const selected = NETWORK_TYPES.filter(item => item.label === networkName);
    return selected.length > 0 ? selected[0] : NETWORK_TYPES[0];
};

export {
    NETWORK_TYPES,
    getNetworkType,
    NetworkType
};
