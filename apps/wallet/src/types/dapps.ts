import React from 'react';
import { ChainTypeInterface } from '@/utils/networks/interfaces';
import * as wasm from 'ergo-lib-wasm-browser';
import { VariantType } from 'notistack';

interface DAppType {
  name: string;
  description: string;
  readme?: React.ReactNode;
  icon?: React.ReactNode;
  color: string;
  id: string;
  networks: Array<wasm.NetworkPrefix>;
  component: React.ComponentType<DAppPropsType>;
}

export interface AssetInfo {
  amount: bigint;
  id: string;
  name: string;
  decimal: number;
}

export interface CoveringResult {
  covered: boolean;
  boxes: wasm.ErgoBoxes;
}

export type UnsignedGeneratedTx = {
  tx: wasm.UnsignedTransaction | wasm.ReducedTransaction;
  boxes: wasm.ErgoBoxes;
  dataBoxes?: wasm.ErgoBoxes;
};

interface DAppPropsType {
  walletId: number;
  getAddresses: () => Promise<Array<string>>;
  getDefaultAddress: () => Promise<string>;
  getAssets: () => Promise<Array<AssetInfo>>;
  getCoveringForErgAndToken: (
    amount: bigint,
    tokens: Array<{ id: string; amount: bigint }>,
    address?: string,
  ) => Promise<CoveringResult>;
  chain: ChainTypeInterface;
  getTokenAmount: (tokenId?: string) => Promise<bigint>;
  signAndSendTx: (tx: UnsignedGeneratedTx) => unknown;
  showNotification: (message: string, type: VariantType) => unknown;
}

interface TokenAmount {
  [tokenId: string]: {
    amount: bigint;
    total: bigint;
  };
}

export type { DAppPropsType };

export type { DAppType };

export type { TokenAmount };
