import { WalletStateType } from '@minotaur-ergo/types';
import config, { ConfigStateType } from './reducer/config';
import wallet from './reducer/wallet';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({ wallet, config });

const store = configureStore({ reducer });

export default store;

interface GlobalStateType {
  wallet: WalletStateType;
  config: ConfigStateType;
}

export type { ConfigStateType, WalletStateType, GlobalStateType };
