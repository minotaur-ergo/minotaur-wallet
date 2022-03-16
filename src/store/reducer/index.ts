import { combineReducers } from "redux";
import wallet, { WalletStateType } from "./wallet";

export default combineReducers({wallet})

export interface GlobalStateType {
    wallet: WalletStateType;
}
