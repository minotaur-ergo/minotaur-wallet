import {
  AddressBalance,
  AddressBalanceMap,
  AddressBalancePayload,
  InitializeAllPayload,
  StateAddress,
  StateWallet,
  TokenValue,
  WalletStateType,
} from '@minotaur-ergo/types';
import { DEFAULT_ADDRESS_PREFIX } from '@minotaur-ergo/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const walletInitialState: WalletStateType = {
  wallets: [],
  addresses: [],
  balances: {},
  loadedWalletPinType: '',
  walletsValid: false,
  addressesValid: false,
  initialized: false,
  refresh: false,
  updatedWallets: [],
  tokenValues: new Map(),
  balanceHistory: {},
  loadingBalanceHistory: false,
};

const updateWalletBalance = (
  wallet: StateWallet,
  stateAddresses: Array<StateAddress>,
) => {
  const addresses = stateAddresses.filter(
    (address) => address.walletId === wallet.id,
  );
  wallet.balance = addresses
    .reduce((a, b) => a + BigInt(b.balance), 0n)
    .toString();
  const tokens: { [tokenId: string]: bigint } = {};
  addresses.forEach((address) => {
    address.tokens.forEach((token) => {
      if (Object.keys(tokens).includes(token.tokenId)) {
        tokens[token.tokenId] += BigInt(token.balance);
      } else {
        tokens[token.tokenId] = BigInt(token.balance);
      }
    });
  });
  wallet.tokens = Object.entries(tokens).map((item) => ({
    tokenId: item[0],
    balance: item[1].toString(),
  }));
  if (
    wallet.flags.filter((item) => item.startsWith(DEFAULT_ADDRESS_PREFIX))
      .length === 0
  ) {
    wallet.flags.push(DEFAULT_ADDRESS_PREFIX + '0');
  }
  addresses.forEach(
    (item) =>
      (item.isDefault = wallet.flags.includes(
        DEFAULT_ADDRESS_PREFIX + item.idx,
      )),
  );
  wallet.addresses = addresses;
};

const updateAddressBalance = (
  address: StateAddress,
  balances: AddressBalanceMap,
) => {
  const addressBalances: AddressBalance = balances[address.address] || {
    tokens: [],
    amount: '0',
  };
  address.balance = addressBalances.amount;
  address.tokens = addressBalances.tokens.filter((item) => {
    try {
      return BigInt(item.balance) > 0n;
    } catch (e) {
      return false;
    }
  });
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState: walletInitialState,
  reducers: {
    initialize(state, action: PayloadAction<InitializeAllPayload>) {
      state.balances = action.payload.balances;
      action.payload.addresses.forEach((address) =>
        updateAddressBalance(address, action.payload.balances),
      );
      state.addresses = action.payload.addresses;
      action.payload.wallets.forEach((wallet) =>
        updateWalletBalance(wallet, state.addresses),
      );
      state.wallets = action.payload.wallets;
      state.walletsValid = true;
      state.addressesValid = true;
      state.initialized = true;
    },
    setWallets(
      state,
      action: PayloadAction<{ pinType: string; wallets: Array<StateWallet> }>,
    ) {
      action.payload.wallets.forEach((wallet) =>
        updateWalletBalance(wallet, state.addresses),
      );
      state.wallets = action.payload.wallets;
      state.loadedWalletPinType = action.payload.pinType;
      state.walletsValid = true;
    },
    setAddresses(state, action: PayloadAction<Array<StateAddress>>) {
      action.payload.forEach((address) =>
        updateAddressBalance(address, state.balances),
      );
      state.addresses = action.payload;
      state.wallets.forEach((wallet) =>
        updateWalletBalance(wallet, state.addresses),
      );
      state.addressesValid = true;
    },
    setBalances(state, action: PayloadAction<AddressBalancePayload>) {
      state.balances[action.payload.address] = action.payload.balance;
      state.addresses
        .filter((address) => address.address === action.payload.address)
        .forEach((address) => {
          updateAddressBalance(address, state.balances);
          state.wallets
            .filter((wallet) => wallet.id === address.walletId)
            .forEach((wallet) => updateWalletBalance(wallet, state.addresses));
        });
    },
    setTokenValues(state, action: PayloadAction<Map<string, TokenValue>>) {
      state.tokenValues = action.payload;
    },
    setBalanceHistory(state, action: PayloadAction<Record<number, number[]>>) {
      state.balanceHistory = action.payload;
    },
    setLoadingBalanceHistory(state, action: PayloadAction<boolean>) {
      state.loadingBalanceHistory = action.payload;
    },
    invalidateWallets(state) {
      state.walletsValid = false;
      state.addressesValid = false;
    },
    invalidateAddresses(state) {
      state.addressesValid = false;
    },
    forceRefresh(state, action: PayloadAction<boolean>) {
      state.refresh = action.payload;
    },
    clearUpdatedWallets(state) {
      state.updatedWallets = [];
      state.refresh = false;
    },
    addUpdatedWallets(state, action: PayloadAction<number>) {
      state.updatedWallets.push(action.payload);
    },
    addedWallets(state) {
      state.walletsValid = false;
      state.addressesValid = false;
      state.refresh = false;
    },
  },
});

export default walletSlice.reducer;
export const {
  initialize,
  invalidateAddresses,
  invalidateWallets,
  setWallets,
  setAddresses,
  setBalances,
  setTokenValues,
  setBalanceHistory,
  setLoadingBalanceHistory,
  addUpdatedWallets,
  clearUpdatedWallets,
  forceRefresh,
  addedWallets,
} = walletSlice.actions;
