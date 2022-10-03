import * as wasm from 'ergo-lib-wasm-browser';
import { Node } from './network/node';
import { Explorer } from './network/explorer';
import Wallet from '../db/entities/Wallet';
import { SnackbarMessage, VariantType } from 'notistack';

export interface NetworkTypeInterface {
  readonly node: string;
  readonly explorer: string;
  readonly explorer_front: string;
  readonly color: string;
  readonly prefix: wasm.NetworkPrefix;
  readonly label: string;
}

class NetworkType implements NetworkTypeInterface {
  readonly color: string;
  readonly explorer: string;
  readonly explorer_front: string;
  readonly node: string;
  readonly prefix: wasm.NetworkPrefix;
  readonly label: string;
  private nodeApi: Node | undefined;
  private explorerApi: Explorer | undefined;

  constructor(
    node: string,
    explorer: string,
    explorer_front: string,
    prefix: wasm.NetworkPrefix,
    color: string,
    label: string
  ) {
    this.color = color;
    this.explorer = explorer;
    this.explorer_front = explorer_front;
    this.node = node;
    this.prefix = prefix;
    this.label = label;
  }

  getNode = () => {
    if (!this.nodeApi) {
      this.nodeApi = new Node(this.node);
    }
    return this.nodeApi;
  };

  getExplorer = () => {
    if (!this.explorerApi) {
      this.explorerApi = new Explorer(this.explorer, this.prefix);
    }
    return this.explorerApi;
  };
}

export interface CoveringResult {
  covered: boolean;
  boxes: wasm.ErgoBoxes;
}

export interface DAppPropsType {
  getAddresses: () => Promise<Array<string>>;
  getCoveringForErgAndToken: (
    amount: bigint,
    tokens: Array<{ id: string; amount: bigint }>,
    address?: string
  ) => Promise<CoveringResult>;
  signAndSendTx: (unsignedTx: UnsignedGeneratedTx) => Promise<any>;
  network_type: NetworkType;
  getTokenAmount: (tokenId?: string) => Promise<bigint>;
  showNotification: (message: SnackbarMessage, variant: VariantType) => any;
  scanQrCode: (callback: (response: string) => any) => any;
}

export type UnsignedGeneratedTx = {
  tx: wasm.UnsignedTransaction | wasm.ReducedTransaction;
  boxes: wasm.ErgoBoxes;
  data_inputs?: wasm.ErgoBoxes;
};

export interface WalletPagePropsType {
  wallet: Wallet;
  setTab: (name: string) => any;
}

export { NetworkType };
