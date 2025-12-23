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
  encryptedMnemonic?: string;
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

export interface ExportSelection {
  wallet: ExportWallet;
  secret: boolean;
  selected: boolean;
}

export enum ImportProcessingState {
  Pending = 'pending',
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
}

export interface WalletWithProblem {
  id: number;
  name: string;
}

export interface RestoreWalletFlags {
  duplicate?: WalletWithProblem;
  convert?: WalletWithProblem;
  noSignerWallet?: boolean;
}

export interface RestoreWalletWithSelection {
  wallet: ExportWallet;
  selected: boolean;
  flags: RestoreWalletFlags;
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
  name?: string;
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
  tokenValues: Map<string, TokenValue>;
  balanceHistory: Record<number, number[]>;
  loadingBalanceHistory: boolean;
}

export enum ConfigType {
  DisplayMode = 'DISPLAY_DETAIL',
  Currency = 'CURRENCY',
  ActiveWallet = 'ACTIVE_WALLET',
  useActiveWallet = 'USE_ACTIVE_WALLET',
  MainnetSyncWithNode = 'MAINNET_SYNC_WITH_NODE',
  MainnetNodeAddress = 'MAINNET_NODE_ADDRESS',
  TestnetSyncWithNode = 'TESTNET_SYNC_WITH_NODE',
  TestnetNodeAddress = 'TESTNET_NODE_ADDRESS',
}

export type DisplayType = 'simple' | 'advanced';

export interface PinConfig {
  hasPin: boolean;
  activePinType: string;
  locked: boolean;
  loaded: boolean;
}

export interface SymbolType {
  symbol: string;
  direction: 'l' | 'r';
}

export interface TokenValue {
  valueInErg: number;
  decimal: number;
}

export interface ConfigStateType {
  display: DisplayType;
  currency: string;
  symbol: SymbolType;
  price: number;
  priceLastWeek: number;
  activeWallet?: number;
  useActiveWallet: boolean;
  mainnetSyncWithNode: boolean;
  testnetSyncWithNode: boolean;
  mainnetNodeAddress: string;
  testnetNodeAddress: string;
  multiSigLoadedTime: number;
  loadedPinType: string;
  pin: PinConfig;
}

export interface GlobalStateType {
  wallet: WalletStateType;
  config: ConfigStateType;
}
