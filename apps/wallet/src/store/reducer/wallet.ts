import { WalletType } from '@/db/entities/Wallet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TokenInfo {
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
  tokens: Array<TokenInfo>;
  addresses: Array<StateAddress>;
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
  tokens: Array<TokenInfo>;
}

export interface AddressBalance {
  amount: string;
  tokens: Array<TokenInfo>;
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
  walletsValid: boolean;
  addressesValid: boolean;
  initialized: boolean;
  refresh: boolean;
  updatedWallets: Array<number>;
}

export const walletInitialState: WalletStateType = {
  wallets: [],
  addresses: [],
  balances: {},
  walletsValid: false,
  addressesValid: false,
  initialized: false,
  refresh: false,
  updatedWallets: [],
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
  address.tokens = addressBalances.tokens;
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
    setWallets(state, action: PayloadAction<Array<StateWallet>>) {
      action.payload.forEach((wallet) =>
        updateWalletBalance(wallet, state.addresses),
      );
      state.wallets = action.payload;
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
  addUpdatedWallets,
  clearUpdatedWallets,
  forceRefresh,
  addedWallets,
} = walletSlice.actions;
