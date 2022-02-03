import { combineReducers } from "redux";
import qrcode, { QrCodeStateType } from "./qrcode";
import wallet, { WalletStateType } from "./wallet";

export default combineReducers({qrcode, wallet})

export interface GlobalStateType {
    qrcode: QrCodeStateType;
    wallet: WalletStateType;
}
