import * as wasm from 'ergo-lib-wasm-browser';


export const PASSWORD_LENGTH = 1;
// export const NETWORK_TYPE = wasm.NetworkPrefix.Testnet;
// export const EXPLORER_URL = "https://api-testnet.ergoplatform.com"
// export const EXPLORER_FRONT_URL = "https://testnet.ergoplatform.com"
// export const NODE_URL = "http://213.239.193.208:9052";
export const NETWORK_TYPE = wasm.NetworkPrefix.Mainnet;
export const EXPLORER_URL = "http://10.10.9.3:7000";
export const EXPLORER_FRONT_URL = "http://10.10.9.3:5000";
export const NODE_URL = "http://10.10.9.3:9064";


export const PAGE_SIZE = 10;

export const ERG_FACTOR: bigint = BigInt(1e9);

export const FEE = BigInt(1100000);

export const QRCODE_SIZE_DEFAULT = 1000;
export const MAX_CHUNK_SIZE = 2900;

export const CONFIRMATION_HEIGHT = 20;

export const REFRESH_INTERVAL = 30 * 1000;
