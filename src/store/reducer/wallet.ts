import * as actionTypes from "../actionType";
import WalletWithErg from "../../db/entities/views/WalletWithErg";
export type DisplayType = "simple" | "advanced"
export interface WalletStateType {
    wallets: Array<WalletWithErg>;
    walletValid: boolean;
    display: DisplayType;
    loadingWallet?: number;
}

export const apiInitialState: WalletStateType = {
    wallets: [],
    walletValid: false,
    display: "simple"
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
                loadingWallet: (action.payload && action.payload.removeLoadingWallet) ? undefined : state.loadingWallet
            };
        case actionTypes.SET_DISPLAY_MODE:
            return {
                ...state,
                display: (action.payload! === "advanced" ? "advanced" : "simple") as DisplayType
            };
        case actionTypes.SET_LOADING_WALLET:
            return {
                ...state,
                loadingWallet: action.payload as number,
                walletValid: false
            }
        case actionTypes.REMOVE_LOADING_WALLET:
            return {
                ...state,
                loadingWallet: undefined
            }
    }
    return state;
};

export default reducer;
