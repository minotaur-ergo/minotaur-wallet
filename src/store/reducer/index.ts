import { combineReducers } from 'redux';
import wallet, { WalletStateType } from './wallet';
import qrcode, { QrCodeStateType } from './qrcode';
import message, { EnqueueMessage } from './message';

export default combineReducers({ wallet, qrcode, message });

export interface GlobalStateType {
  wallet: WalletStateType;
  qrcode: QrCodeStateType;
  message: EnqueueMessage;
}
