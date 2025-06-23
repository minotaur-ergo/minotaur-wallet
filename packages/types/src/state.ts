import { WalletType } from './db';

export interface TokenBalance {
  tokenId: string;
  balance: string;
}

export interface StateWallet {
  id: number;
  name: string;
  networkType: string;
  seed: string;
  xPub: string;
  type: WalletType;
  requiredSign: number;
  version: number;
  balance: string;
  tokens: Array<TokenBalance>;
  addresses: Array<StateAddress>;
  flags: Array<string>;
  archived: boolean;
  favorite: boolean;
}

export interface StateAddress {
  id: number;
  name: string;
  address: string;
  path: string;
  idx: number;
  balance: string;
  walletId: number;
  proceedHeight: number;
  tokens: Array<TokenBalance>;
  isDefault: boolean;
}

export interface AddressBalance {
  amount: string;
  tokens: Array<TokenBalance>;
}

export interface AddressBalancePayload {
  address: string;
  balance: AddressBalance;
}

export type AddressBalanceMap = { [address: string]: AddressBalance };

export interface InitializeAllPayload {
  wallets: Array<StateWallet>;
  addresses: Array<StateAddress>;
  balances: AddressBalanceMap;
}

export interface WalletStateType {
  wallets: Array<StateWallet>;
  addresses: Array<StateAddress>;
  balances: { [address: string]: AddressBalance };
  loadedWalletPinType: string;
  walletsValid: boolean;
  addressesValid: boolean;
  initialized: boolean;
  refresh: boolean;
  updatedWallets: Array<number>;
}

export type DisplayType = 'simple' | 'advanced';

export interface PinConfig {
  hasPin: boolean;
  activePinType: string;
  locked: boolean;
  loaded: boolean;
}

export interface ConfigStateType {
  display: DisplayType;
  currency: string;
  price: number;
  priceLastWeek: number;
  activeWallet?: number;
  useActiveWallet: boolean;
  multiSigLoadedTime: number;
  loadedPinType: string;
  pin: PinConfig;
}

export interface GlobalStateType {
  wallet: WalletStateType;
  config: ConfigStateType;
}
