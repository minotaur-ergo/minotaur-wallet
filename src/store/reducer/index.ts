import { combineReducers } from "redux";
import wallet, { WalletStateType } from "./wallet";
import qrcode, { QrCodeStateType } from "./qrcode";

export default combineReducers({wallet, qrcode})

export interface GlobalStateType {
    wallet: WalletStateType;
    qrcode: QrCodeStateType
}
