import { MAIN_NET_LABEL, TEST_NET_LABEL } from './const';
import { TokenBalance, WalletType } from './db';
import { EXPLORER_NETWORK, NETWORK_BACKEND, NODE_NETWORK } from './network';

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
  showBalanceChart: boolean;
}

export const BackendUrlGenerator = (network: string, backend: string) => {
  const parts = [network, backend, 'URL'];
  return parts
    .map((item) => item.replace(/[ _-]/g, '').toUpperCase())
    .join('_');
};

const MAINNET_NODE_URL_KEY = BackendUrlGenerator(MAIN_NET_LABEL, NODE_NETWORK);
const TESTNET_NODE_URL_KEY = BackendUrlGenerator(TEST_NET_LABEL, NODE_NETWORK);
const MAINNET_EXPLORER_URL_KEY = BackendUrlGenerator(
  MAIN_NET_LABEL,
  EXPLORER_NETWORK,
);
const TESTNET_EXPLORER_URL_KEY = BackendUrlGenerator(
  TEST_NET_LABEL,
  EXPLORER_NETWORK,
);

export const ConfigType = {
  DisplayMode: 'DISPLAY_DETAIL',
  Currency: 'CURRENCY',
  ActiveWallet: 'ACTIVE_WALLET',
  UseActiveWallet: 'USE_ACTIVE_WALLET',
  MainnetBackend: 'MAINNET_BACKEND',
  MainnetNodeUrl: MAINNET_NODE_URL_KEY,
  MainnetExplorerUrl: MAINNET_EXPLORER_URL_KEY,
  TestnetBackend: 'TESTNET_BACKEND',
  TestnetNodeUrl: TESTNET_NODE_URL_KEY,
  TestnetExplorerUrl: TESTNET_EXPLORER_URL_KEY,
} as const;

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

export interface NetworkSettingType {
  node: string;
  explorer: string;
  backend: NETWORK_BACKEND;
}

export interface ConfigStateType {
  display: DisplayType;
  currency: string;
  symbol: SymbolType;
  price: number;
  priceLastWeek: number;
  activeWallet?: number;
  useActiveWallet: boolean;
  network: {
    mainnet: NetworkSettingType;
    testnet: NetworkSettingType;
  };
  multiSigLoadedTime: number;
  loadedPinType: string;
  pin: PinConfig;
}

export interface GlobalStateType {
  wallet: WalletStateType;
  config: ConfigStateType;
}
