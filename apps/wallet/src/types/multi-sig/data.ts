import * as wasm from 'ergo-lib-wasm-browser';

export enum MultiSigDataHintType {
  SIMULATED = 'simulated',
  REAL = 'real',
}

export interface MultiSigDataShare {
  tx: string;
  boxes: Array<string>;
  hints: Array<Array<string>>;
}

export interface MultiSigDataHint {
  commit: string;
  proof: string;
  type: MultiSigDataHintType;
}

export interface MultiSigData {
  hints: Array<Array<MultiSigDataHint>>;
  secrets: Array<Array<string>>;
}

export interface DetachedCommitments {
  own: wasm.TransactionHintsBag;
  known: wasm.TransactionHintsBag;
}

export interface CommitResult {
  hints: Array<Array<MultiSigDataHint>>;
  secrets: Array<Array<string>>;
  updateTime: number;
  rowId?: number;
  changed: boolean;
}
