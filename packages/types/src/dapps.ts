import React from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { VariantType } from 'notistack';

import { TokenBalanceBigInt } from './db';
import { ChainTypeInterface } from './network';

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
    tokens: Array<TokenBalanceBigInt>,
    address?: string,
  ) => Promise<CoveringResult>;
  chain: ChainTypeInterface;
  getTokenAmount: (tokenId?: string) => Promise<bigint>;
  signAndSendTx: (tx: UnsignedGeneratedTx) => unknown;
  showNotification: (message: string, type: VariantType) => unknown;
  createChangeBox: (
    inputs: wasm.ErgoBoxes,
    outputs: wasm.ErgoBoxCandidates,
    fee: bigint,
    height: number,
  ) => Promise<Array<wasm.ErgoBoxCandidate>>;
}

interface TokenAmount {
  [tokenId: string]: {
    amount: bigint;
    total: bigint;
    hasError: boolean;
  };
}

export type { DAppPropsType, DAppType, TokenAmount };
