import * as actionTypes from "../actionType";
import WalletWithErg from "../../db/entities/views/WalletWithErg";

export interface WalletStateType {
    wallets: Array<WalletWithErg>;
    walletValid: boolean;
}

export const apiInitialState: WalletStateType = {
    wallets: [],
    walletValid: false,
};

export const reducer = (state = apiInitialState, action: { type: string, payload?: any }) => {
    switch (action.type) {
        case actionTypes.SET_WALLETS:
            return {
                ...state,
                wallets: action.payload,
                walletValid: true,
            };
        case actionTypes.INVALIDATE_WALLETS:
            return {
                ...state,
                walletValid: false,
            };
    }
    return state;
};

export default reducer;
