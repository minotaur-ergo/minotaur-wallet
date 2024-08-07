export type SelectableType = {
  selected?: boolean;
};

export type AssetType = {
  name: string;
  amount: number;
  id: string;
  logoSrc?: string;
};

export type AddressBookType = {
  name: string;
  address: string;
};

export type RegistrationStatusType = 'REGISTERED' | 'WAITING' | 'NONE';

export type MultiSigSignatureType = {
  id: string;
  signed?: boolean;
};

export type RegistrationType = {
  status: RegistrationStatusType;
  requiredSignatures: number;
  signers: MultiSigSignatureType[];
};
