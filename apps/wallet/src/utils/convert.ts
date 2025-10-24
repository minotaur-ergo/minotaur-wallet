import { StateAddress, StateWallet } from '@minotaur-ergo/types';
import { WALLET_FLAG_ENUM } from '@minotaur-ergo/utils';

import Address from '@/db/entities/Address';
import Wallet from '@/db/entities/Wallet';

export const walletEntityToWalletState = (wallet: Wallet): StateWallet => ({
  id: wallet.id,
  name: wallet.name,
  networkType: wallet.network_type,
  type: wallet.type,
  balance: '',
  tokens: [],
  tokensBalanceInNanoErg: '',
  addresses: [],
  xPub: wallet.extended_public_key,
  requiredSign: wallet.required_sign,
  seed: wallet.seed,
  version: wallet.version,
  flags: wallet.flags.split('|').filter(Boolean),
  archived: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.ARCHIVE),
  favorite: wallet.flags.split('|').includes(WALLET_FLAG_ENUM.FAVORITE),
});

export const addressEntityToAddressState = (
  address: Address,
): StateAddress => ({
  address: address.address,
  walletId: address.wallet?.id || 0,
  balance: '',
  name: address.name,
  tokens: [],
  tokensBalanceInNanoErg: '',
  idx: address.idx,
  path: address.path,
  proceedHeight: address.process_height,
  id: address.id,
  isDefault: false,
});
