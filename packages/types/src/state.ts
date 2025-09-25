import { TokenBalance, WalletType } from './db';

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

export interface ExportWallet {
  name: string;
  network: string;
  seed: string;
  xPub: string;
  type: WalletType;
  requiredSign?: number;
  version: number;
  mnemonic?: string;
  signers?: Array<string>;
  addresses?: Array<string>;
}

export enum ImportProcessingState {
  NoData = 'no-data',
  Pending = 'pending',
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface RestoreWalletWithSelection extends ExportWallet {
  selected: boolean;
  duplicate: boolean;
  status: ImportProcessingState;
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

export interface DerivedWalletAddress {
  address: string;
  path: string;
  index: number;
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

export enum ConfigType {
  DisplayMode = 'DISPLAY_DETAIL',
  Currency = 'CURRENCY',
  ActiveWallet = 'ACTIVE_WALLET',
  useActiveWallet = 'USE_ACTIVE_WALLET',
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
