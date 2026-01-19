import { GlobalStateType } from '@minotaur-ergo/types';
import {
  combineReducers,
  configureStore,
  EnhancedStore,
  Reducer,
} from '@reduxjs/toolkit';

import config from './reducer/config';
import wallet from './reducer/wallet';

const reducer: Reducer<GlobalStateType> = combineReducers({ wallet, config });

const store: EnhancedStore<GlobalStateType> = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['wallet.tokenValues'],
        ignoredActions: ['wallet/setTokenValues'],
      },
    }),
});

export default store;
