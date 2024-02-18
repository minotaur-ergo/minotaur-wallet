import { StateWallet } from '@/store/reducer/wallet';
import * as wasm from 'ergo-lib-wasm-browser';

enum MultiAddressSupportedEnum {
  NOT_NEEDED = 'Not Needed',
  SUPPORTED = 'Supported',
  NOT_SUPPORTED = 'Not Supported',
  NOT_CHECKED = 'Not Checked',
  FAILED = 'Failed',
}

enum ErgoPaySeverityEnum {
  Info = 'INFORMATION',
  Warn = 'WARNING',
  Error = 'ERROR',
  Default = 'DEFAULT',
}

interface ErgoPayResponse {
  reducedTx?: string;
  address?: string;
  message?: string;
  messageSeverity?: ErgoPaySeverityEnum;
  replyTo?: string;
}

interface LoadedErgoPayResponse extends ErgoPayResponse {
  url: string;
  failed: boolean;
  loaded: boolean;
  loading: boolean;
}

interface MultipleAddressResponse {
  title: string;
  description: Array<string>;
  severity: string;
  supported: MultiAddressSupportedEnum;
}

interface MessageResponseType {
  title: string;
  description: Array<string>;
  severity: string;
  replyTo?: string;
  failed: boolean;
  loading: boolean;
  selectWallet: boolean;
  selectAddress: boolean;
  allowMultipleAddress: boolean;
  wallets: Array<StateWallet>;
}

// interface MessageResponseType {
//   allowedWallets: Array<StateWallet>;
//   title: string;
//   description: Array<string>;
//   severity: string;
//   needAddress: boolean;
//   replyTo: string;
//   failed: boolean;
// }

// interface InternalBoxLoadedData {
//   walletIds: Array<number>;
//   boxes: Array<wasm.ErgoBox | undefined>;
//   error: string;
// }

interface InternalBoxLoadedData {
  [walletId: string]: Array<wasm.ErgoBox | undefined>;
}

export { MultiAddressSupportedEnum, ErgoPaySeverityEnum };
export type {
  ErgoPayResponse,
  MessageResponseType,
  MultipleAddressResponse,
  LoadedErgoPayResponse,
  InternalBoxLoadedData,
};
