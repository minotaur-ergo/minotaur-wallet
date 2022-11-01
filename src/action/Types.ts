import Address from '../db/entities/Address';
import { ErgoTx } from '../util/network/models';

export type Block = {
  id: string;
  height: number;
};
export type Box = {
  boxId: string;
  value: number;
  address: Address;
};
export type Trx = {
  id: string;
  blockId: string;
  inclusionHeight: number;
  inputs: Box[];
  outputs: Box[];
};
export type HeightRange = {
  fromHeight: number;
  toHeight: number;
};
export type Err = {
  massege: string;
  data: number;
};

export type TokenData = {
  tokenId: string;
  total: bigint;
};
export interface TxDictionary {
  [height: number]: ErgoTx[];
}
