import { Transaction } from '@minotaur-ergo/ergo-lib';

import { StateWallet } from '../state';
import { AddressCompletionState, MultiSigAddressHolder } from './address';
import { MultiSigData } from './data';

export interface MultiSigMyAction {
  committed: boolean;
  signed: boolean;
}

export enum MultiSigStateEnum {
  COMMITMENT = 'commitment',
  SIGNING = 'signing',
  COMPLETED = 'completed',
}

export interface MultiSigContextType {
  hints: MultiSigData;
  rowId: number;
  requiredSign: number;
  setHints: (hints: MultiSigData, updateTime: number) => unknown;
  signed?: Transaction;
  setSigned: (signed: Transaction) => unknown;
}

// kept apart from MultiSigContextType so typing the password re-renders only
// the components that use it
export interface MultiSigPasswordContextType {
  password: string;
  setPassword: (password: string) => unknown;
}

export interface MultiSigDataContextType {
  addresses: Array<MultiSigAddressHolder>;
  actions: Array<AddressCompletionState>;
  state: MultiSigStateEnum;
  lastInState: boolean;
  myAction: MultiSigMyAction;
  related?: StateWallet;
  needPassword: boolean;
  setNeedPassword: (needPassword: boolean) => unknown;
}
