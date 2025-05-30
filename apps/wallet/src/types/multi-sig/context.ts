import { StateWallet } from '@/store/reducer/wallet';
import {
  AddressCompletionState,
  MultiSigAddressHolder,
} from '@/types/multi-sig/address';
import { MultiSigData } from '@/types/multi-sig/data';

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
  password: string;
  setPassword: (password: string) => unknown;
  setHints: (hints: MultiSigData, updateTime: number) => unknown;
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
