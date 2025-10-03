import { ConfigStateType, DisplayType } from '@minotaur-ergo/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCurrencySymbol } from '@/hooks/useCurrencies';

export const configInitialState: ConfigStateType = {
  currency: '',
  symbol: { symbol: '', direction: 'l' },
  priceLastWeek: 0,
  price: 0,
  display: 'advanced',
  multiSigLoadedTime: Date.now(),
  loadedPinType: '-',
  useActiveWallet: true,
  pin: {
    hasPin: false,
    activePinType: '',
    locked: false,
    loaded: false,
  },
};

export type DisplayPayload = {
  display: DisplayType;
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

export type ConfigPayload = CurrencyPayload &
  DisplayPayload &
  ActiveWalletPayload & { pinType: string };

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
    setActiveWallet: (state, action: PayloadAction<ActiveWalletPayload>) => {
      state.activeWallet = action.payload.activeWallet;
      state.useActiveWallet =
        action.payload.useActiveWallet === undefined
          ? state.useActiveWallet
          : action.payload.useActiveWallet;
    },
    setConfig: (state, action: PayloadAction<ConfigPayload>) => {
      state.display = action.payload.display;
      state.currency = action.payload.currency;
      state.symbol = getCurrencySymbol(action.payload.currency);
      state.activeWallet = action.payload.activeWallet;
      state.useActiveWallet = action.payload.useActiveWallet ?? true;
      state.loadedPinType = action.payload.pinType;
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
  setActiveWallet,
  setConfig,
  setMultiSigLoadedTime,
  setPinConfig,
} = configSlice.actions;
