import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigMyAction } from '@/types/multi-sig-old';
import {
  AddressActionRow,
  MultiSigAddressHolder,
} from '@/types/multi-sig/address';
import { MultiSigData } from '@/types/multi-sig/data';

export enum MultiSigStateEnum {
  COMMITMENT = 'commitment',
  SIGNING = 'signing',
  COMPLETED = 'completed',
}

export interface MultiSigContextType {
  data: MultiSigData;
  rowId: number;
  requiredSign: number;
  password: string;
  setPassword: (password: string) => unknown;
  setData: (data: MultiSigData, updateTime: number) => unknown;
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
