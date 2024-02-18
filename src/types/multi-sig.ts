import { StateWallet } from '@/store/reducer/wallet';
import * as wasm from 'ergo-lib-wasm-browser';

export enum MultiSigStateEnum {
  COMMITMENT = 'commitment',
  SIGNING = 'signing',
  COMPLETED = 'completed',
}

export interface MultiSigDataRow {
  rowId: number;
  requiredSign: number;
  tx: wasm.ReducedTransaction;
  partial?: wasm.Transaction;
  dataBoxes: Array<wasm.ErgoBox>;
  boxes: Array<wasm.ErgoBox>;
  simulated: Array<string>;
  signed: Array<string>;
  commitments: Array<Array<string>>;
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
  commitments: Array<Array<string>>;
  simulated?: Array<string>;
  signed?: Array<string>;
  partial?: string;
}

export interface MultiSigData {
  commitments: Array<Array<string>>;
  secrets: Array<Array<string>>;
  signed: Array<string>;
  simulated: Array<string>;
  partial?: wasm.Transaction;
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

export interface HintType {
  hint: string;
  secret?: string;
  pubkey: {
    op: string;
    h: string;
  };
  type: string;
  a: string;
  position: string;
}

export interface TxHintType {
  [key: string]: Array<HintType>;
}

export interface TransactionHintBagType {
  publicHints: TxHintType;
  secretHints: TxHintType;
}
