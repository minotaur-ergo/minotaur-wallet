export type SelectableType = {
  selected?: boolean;
};

export type AssetType = {
  name: string;
  amount: number;
  id: string;
  logoSrc?: string;
};

export type TokenType = {
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

export type TransactionTokenType = {
  name: string;
  amount: number;
  type: 'Received' | 'Issued' | 'Burned';
};

export type WalletType = {
  id: string;
  name: string;
  type: 'Normal' | 'Multi-signature';
  net: 'MAIN-NET' | 'TEST-NET';
  amount: number;
  value: number;
  numberOfTokens?: number;
  favorite?: boolean;
  archived?: boolean;
};

export type SelectWalletType = WalletType &
  SelectableType & {
    withSecret?: boolean;
  };
