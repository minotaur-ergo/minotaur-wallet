export interface MultiSigAddressHolder {
  xPub: string;
  address: string;
  pubKeys: Array<string>;
}

export interface AddressActionRow {
  address: string;
  completed: boolean;
}
