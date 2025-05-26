import * as wasm from 'ergo-lib-wasm-browser';
import { MultiSigDataHint } from './hint';

export interface MultiSigDataShare {
  tx: string;
  boxes: Array<string>;
  hints: Array<Array<string>>;
}

export type MultiSigData = Array<Array<MultiSigDataHint>>;

export interface MultiSigDataRow {
  rowId: number;
  requiredSign: number;
  tx: wasm.ReducedTransaction;
  dataBoxes: Array<wasm.ErgoBox>;
  boxes: Array<wasm.ErgoBox>;
  hints: Array<Array<MultiSigDataHint>>;
}

export interface MultiSigBriefRow {
  rowId: number;
  txId: string;
  committed: number;
  signed: number;
  ergIn: bigint;
  ergOut: bigint;
  tokensIn: number;
  tokensOut: number;
}

export interface CommitResult {
  hints: Array<Array<MultiSigDataHint>>;
  updateTime: number;
  rowId?: number;
  changed: boolean;
}
