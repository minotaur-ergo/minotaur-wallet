import {
  ConfigStateType,
  DisplayType,
  MAIN_NET_LABEL,
  NETWORK_BACKEND,
  NetworkSettingType,
} from '@minotaur-ergo/types';
import { setUrl } from '@minotaur-ergo/utils';
import { getCurrencySymbol } from '@minotaur-ergo/utils/src/currency';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_EXPLORER, DEFAULT_NODE } from '@/utils/const';

export const configInitialState: ConfigStateType = {
  currency: '',
  symbol: { symbol: '', direction: 'l' },
  priceLastWeek: 0,
  price: 0,
  display: 'advanced',
  multiSigLoadedTime: Date.now(),
  loadedPinType: '-',
  useActiveWallet: true,
  hideBalances: false,
  hideAssetsValues: false,
  network: {
    mainnet: {
      backend: NETWORK_BACKEND.EXPLORER,
      explorer: DEFAULT_EXPLORER.mainnet,
      node: DEFAULT_NODE.mainnet,
    },
    testnet: {
      backend: NETWORK_BACKEND.EXPLORER,
      explorer: DEFAULT_EXPLORER.testnet,
      node: DEFAULT_NODE.testnet,
    },
  },
  pin: {
    hasPin: false,
    activePinType: '',
    locked: false,
    loaded: false,
  },
};

export type DisplayPayload = {
  display: DisplayType;
  hideBalances?: boolean;
  hideAssetsValues?: boolean;
};

export type CurrencyPayload = {
  currency: string;
};

export type ActiveWalletPayload = {
  activeWallet: number;
  useActiveWallet?: boolean;
};

export type PinPayload = {
  hasPin?: boolean;
  activeType?: string;
  locked?: boolean;
};

export type NetworkPayload = {
  network: {
    mainnet: NetworkSettingType;
    testnet: NetworkSettingType;
  };
};

export type ConfigPayload = CurrencyPayload &
  DisplayPayload &
  ActiveWalletPayload &
  NetworkPayload & { pinType: string };

export type PricePayload = {
  current: number;
  lastWeek: number;
};

const configSlice = createSlice({
  name: 'config',
  initialState: configInitialState,
  reducers: {
    setPrice: (state, action: PayloadAction<PricePayload>) => {
      state.price = action.payload.current;
      state.priceLastWeek = action.payload.lastWeek;
    },
    setDisplay: (state, action: PayloadAction<DisplayPayload>) => {
      state.display = action.payload.display;
    },
    setCurrency: (state, action: PayloadAction<CurrencyPayload>) => {
      state.currency = action.payload.currency;
      state.symbol = getCurrencySymbol(action.payload.currency);
    },
    setNodeUrl: (
      state,
      action: PayloadAction<{ network: string; url: string }>,
    ) => {
      const network =
        action.payload.network === MAIN_NET_LABEL
          ? state.network.mainnet
          : state.network.testnet;
      network.node = action.payload.url;
      setUrl(action.payload.network, network);
    },
    setExplorerUrl: (
      state,
      action: PayloadAction<{ network: string; url: string }>,
    ) => {
      const network =
        action.payload.network === MAIN_NET_LABEL
          ? state.network.mainnet
          : state.network.testnet;
      network.explorer = action.payload.url;
      setUrl(action.payload.network, network);
    },
    setBackend: (
      state,
      action: PayloadAction<{ network: string; backend: NETWORK_BACKEND }>,
    ) => {
      const network =
        action.payload.network === MAIN_NET_LABEL
          ? state.network.mainnet
          : state.network.testnet;
      network.backend = action.payload.backend;
      setUrl(action.payload.network, network);
    },
    setActiveWallet: (state, action: PayloadAction<ActiveWalletPayload>) => {
      state.activeWallet = action.payload.activeWallet;
      state.useActiveWallet =
        action.payload.useActiveWallet === undefined
          ? state.useActiveWallet
          : action.payload.useActiveWallet;
    },
    setHideBalances: (state, action: PayloadAction<boolean>) => {
      state.hideBalances =
        action.payload === undefined ? state.hideBalances : action.payload;
    },
    setHideAssetsValues: (state, action: PayloadAction<boolean>) => {
      state.hideAssetsValues =
        action.payload === undefined ? state.hideAssetsValues : action.payload;
    },
    setConfig: (state, action: PayloadAction<ConfigPayload>) => {
      state.display = action.payload.display;
      state.currency = action.payload.currency;
      state.symbol = getCurrencySymbol(action.payload.currency);
      state.activeWallet = action.payload.activeWallet;
      state.useActiveWallet = action.payload.useActiveWallet ?? true;
      state.loadedPinType = action.payload.pinType;
      state.network.mainnet = action.payload.network.mainnet;
      state.network.testnet = action.payload.network.testnet;
      state.hideBalances = action.payload.hideBalances ?? false;
      state.hideAssetsValues = action.payload.hideAssetsValues ?? false;
    },
    setPinConfig: (state, action: PayloadAction<PinPayload>) => {
      state.pin.hasPin =
        action.payload.hasPin === undefined
          ? state.pin.hasPin
          : action.payload.hasPin;
      state.pin.activePinType =
        action.payload.activeType === undefined
          ? state.pin.activePinType
          : action.payload.activeType;
      state.pin.locked =
        action.payload.locked === undefined
          ? state.pin.locked
          : action.payload.locked;
      state.pin.loaded = true;
    },
    setMultiSigLoadedTime: (state, action: PayloadAction<number>) => {
      state.multiSigLoadedTime = action.payload;
    },
  },
});

export default configSlice.reducer;

export const {
  setPrice,
  setDisplay,
  setCurrency,
  setBackend,
  setNodeUrl,
  setExplorerUrl,
  setActiveWallet,
  setHideBalances,
  setHideAssetsValues,
  setConfig,
  setMultiSigLoadedTime,
  setPinConfig,
} = configSlice.actions;
