import {
  ExportWallet,
  StateAddress,
  StateWallet,
  WalletType,
} from '@minotaur-ergo/types';
import { getNewAddressName, WALLET_FLAG_ENUM } from '@minotaur-ergo/utils';

import { MultiSigDbAction } from '@/action/db';
import Address from '@/db/entities/Address';
import Wallet from '@/db/entities/Wallet';

export const walletEntityToWalletState = (wallet: Wallet): StateWallet => ({
  id: wallet.id,
  name: wallet.name,
  networkType: wallet.network_type,
  type: wallet.type,
  balance: '',
  tokens: [],
  addresses: [],
  xPub: wallet.extended_public_key,
  requiredSign: wallet.required_sign,
  seed: wallet.seed,
  version: wallet.version,
  flags: wallet.flags.split('|').filter(Boolean),
  archived: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.ARCHIVE),
  favorite: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.FAVORITE),
  encryptedMnemonic: wallet.encrypted_mnemonic,
});

export const addressEntityToAddressState = (
  address: Address,
): StateAddress => ({
  address: address.address,
  walletId: address.wallet?.id || 0,
  balance: '',
  name: address.name,
  tokens: [],
  idx: address.idx,
  path: address.path,
  proceedHeight: address.process_height,
  id: address.id,
  isDefault: false,
});

const toExportAddress = (address: StateAddress) => {
  const addressName = getNewAddressName('', address.idx);
  if (address.name === addressName) {
    return address.address;
  }
  return `${address.address}#${address.name}`;
};

export const toExport = async (
  wallet: StateWallet,
  addSecret: boolean,
): Promise<ExportWallet> => {
  const res: ExportWallet = {
    name: wallet.name,
    network: wallet.networkType,
    type: wallet.type,
    xPub: wallet.xPub,
    addresses: wallet.addresses.map(toExportAddress),
    seed: addSecret ? wallet.seed : '',
    mnemonic: addSecret ? wallet.encryptedMnemonic : '',
    version: wallet.version,
  };
  if (wallet.type === WalletType.MultiSig) {
    res.requiredSign = wallet.requiredSign;
    const signers = await MultiSigDbAction.getInstance().getWalletKeys(
      wallet.id,
    );
    res.signers = signers.map(
      (item) => (item.sign_wallet ? '+' : '-') + item.extended_key,
    );
  }
  return res;
};
