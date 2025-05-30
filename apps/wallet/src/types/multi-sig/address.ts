export interface MultiSigAddressHolder {
  xPub: string;
  address: string;
  pubKeys: Array<string>;
}

export interface AddressCompletionState {
  address: string;
  committed: boolean;
  signed: boolean;
}

export interface AddressActionRow {
  address: string;
  completed: boolean;
}
