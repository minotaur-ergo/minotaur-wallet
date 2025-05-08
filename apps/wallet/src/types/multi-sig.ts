import { StateWallet } from '@/store/reducer/wallet';
import * as wasm from 'ergo-lib-wasm-browser';

export enum MultiSigStateEnum {
  COMMITMENT = 'commitment',
  SIGNING = 'signing',
  COMPLETED = 'completed',
}

export enum MultiSigHintType {
  SIMULATED = 'simulated',
  REAL = 'real',
}

export interface MultiSigDataRow {
  rowId: number;
  requiredSign: number;
  tx: wasm.ReducedTransaction;
  dataBoxes: Array<wasm.ErgoBox>;
  boxes: Array<wasm.ErgoBox>;
  signed: Array<string>;
  hints: Array<Array<string>>;
  secrets: Array<Array<string>>;
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

export interface MultiSigShareData {
  tx: string;
  boxes: Array<string>;
  hints: Array<Array<string>>;
}

export interface MultiSigHint {
  commit: string;
  proof: string;
  type: MultiSigHintType;
}

export interface MultiSigData {
  hints: Array<Array<MultiSigHint>>;
  secrets: Array<Array<string>>;
}

export interface MultiSigContextType {
  data: MultiSigData;
  rowId: number;
  requiredSign: number;
  password: string;
  setPassword: (password: string) => unknown;
  setData: (data: MultiSigData, updateTime: number) => unknown;
}

export interface MultiSigAddressHolder {
  xPub: string;
  address: string;
  pubKeys: Array<string>;
}

export interface AddressActionRow {
  address: string;
  completed: boolean;
}

export interface MyAction {
  committed: boolean;
  signed: boolean;
}

export interface MultiSigMyAction {
  committed: boolean;
  signed: boolean;
}

export interface MultiSigDataContextType {
  addresses: Array<MultiSigAddressHolder>;
  committed: Array<AddressActionRow>;
  signed: Array<AddressActionRow>;
  state: MultiSigStateEnum;
  lastInState: boolean;
  myAction: MultiSigMyAction;
  related?: StateWallet;
  needPassword: boolean;
  setNeedPassword: (needPassword: boolean) => unknown;
}

interface TxHintPublicKey {
  op: string;
  h: string;
}

export interface TxSingleSecretHint {
  hint: string;
  challenge: string;
  position: string;
  proof: string;
  pubkey: TxHintPublicKey;
}

export interface TxSinglePublicHint {
  hint: string;
  secret?: string;
  pubkey: TxHintPublicKey;
  type: string;
  a: string;
  position: string;
}

export interface TxPublicHint {
  [key: string]: Array<TxSinglePublicHint>;
}

export interface TxSecretHint {
  [key: string]: Array<TxSingleSecretHint>;
}

export interface TxHintBag {
  publicHints: TxPublicHint;
  secretHints: TxSecretHint;
}

export interface DetachedCommitments {
  own: wasm.TransactionHintsBag;
  known: wasm.TransactionHintsBag;
}

export interface CommitResult {
  hints: Array<Array<MultiSigHint>>;
  secrets: Array<Array<string>>;
  updateTime: number;
  rowId?: number;
  changed: boolean;
}
