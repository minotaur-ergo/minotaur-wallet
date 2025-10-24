import React from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';

export enum WalletType {
  ReadOnly = 'READ_ONLY',
  Normal = 'NORMAL',
  MultiSig = 'MULTI_SIG',
}

export interface TokenBalance {
  tokenId: string;
  balance: string;
  valueInNanoErg: string;
}

export interface TokenBalanceBigInt {
  tokenId: string;
  balance: bigint;
}

export enum RegisterKeys {
  R4 = 4,
  R5 = 5,
  R6 = 6,
  R7 = 7,
  R8 = 8,
  R9 = 9,
}

export interface ReceiverType {
  address: string;
  amount: bigint;
  tokens: TokenBalanceBigInt[];
  registers?: {
    [register in RegisterKeys]: wasm.Constant;
  };
}

export interface TokenInfo {
  id: string;
  boxId?: string;
  name?: string;
  description?: string;
  height: number;
  decimals?: number;
  emissionAmount?: bigint;
  txId?: string;
}

export interface BoxCreateInfo {
  index: number;
  height: number;
  tx: string;
  timestamp: number;
}

export interface BoxInfo {
  address: string;
  boxId: string;
  create: BoxCreateInfo;
  spend?: BoxCreateInfo;
  serialized: string;
}

export interface TxInfo {
  height: number;
  timestamp: number;
}

export interface ItemBoxInfos {
  items: Array<BoxInfo>;
  total: number;
}

export interface WalletTransactionType {
  txId: string;
  date: Date;
  ergIn: bigint;
  ergOut: bigint;
  tokens: Map<string, bigint>;
}

export interface AssetDetailType {
  name: string;
  logoPath?: string;
  logo?: React.ReactElement;
  description: string;
  decimal: number;
  emissionAmount: bigint;
  txId: string;
  tokenId: string;
}

export interface TransactionValues {
  total: bigint;
  txId: string;
  tokens: { [tokenId: string]: bigint };
}

export interface BoxContent {
  address: string;
  amount: bigint;
  tokens: Array<TokenBalanceBigInt>;
}
