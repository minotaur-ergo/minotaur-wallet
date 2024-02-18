import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DisplayType = 'simple' | 'advanced';

export interface ConfigStateType {
  display: DisplayType;
  currency: string;
  price: number;
  priceLastWeek: number;
  activeWallet?: number;
  loaded: boolean;
  multiSigLoadedTime: number;
}

export const configInitialState: ConfigStateType = {
  currency: '',
  priceLastWeek: 0,
  price: 0,
  display: 'simple',
  loaded: false,
  multiSigLoadedTime: Date.now(),
};

export type DisplayPayload = {
  display: DisplayType;
};

export type CurrencyPayload = {
  currency: string;
};

export type ActiveWalletPayload = {
  activeWallet: number;
};

export type ConfigPayload = CurrencyPayload &
  DisplayPayload &
  ActiveWalletPayload;

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
    },
    setActiveWallet: (state, action: PayloadAction<ActiveWalletPayload>) => {
      state.activeWallet = action.payload.activeWallet;
    },
    setConfig: (state, action: PayloadAction<ConfigPayload>) => {
      state.display = action.payload.display;
      state.currency = action.payload.currency;
      state.activeWallet = action.payload.activeWallet;
      state.loaded = true;
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
} = configSlice.actions;
