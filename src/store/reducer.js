import * as actionTypes from './actionType';
import { INVALIDATE_ADDRESS } from "./actionType";

export const apiInitialState = {
  wallets: [],
  selectedWalletId: null,
  valid: {
    wallet: false,
    address: null
  },
  address: [],
  transactions: [],
  boxes: [],
  assets: [],
};

export const reducer = (state = apiInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WALLETS:
      return {
        ...state,
        wallets: action.payload,
        valid: {
          ...state.valid,
          wallet: true
        }
      };
    case actionTypes.INVALIDATE_WALLETS:
      return {
        ...state,
        valid: {
          ...state.valid,
          wallet: false
        }
      }
    case actionTypes.SET_ADDRESS:
      return {
        ...state,
        address: action.payload.address,
        valid: {
          ...state.valid,
          address: action.payload.wallet,
        }
      };
    case actionTypes.INVALIDATE_ADDRESS:
      return {
        ...state,
        valid: {
          ...state.valid,
          address: null
        }
      }
    case actionTypes.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      }
    case actionTypes.SET_BOXES:
      return {
        ...state,
        boxes: action.payload,
      }
    case actionTypes.SET_ASSETS:
      return {
        ...state,
        assets: action.payload
      }
    case actionTypes.SELECT_WALLET:
      return {
        ...state,
        selectedWallet: action.payload.selectedWallet,
        transactions: action.payload.transactions || [],
        addresses: action.addresses || [],
        boxes: action.boxes || [],
      }
    default:
  }
  return state
};

export default reducer;
