import {
  AddressBalance,
  AddressBalanceMap,
  InitializeAllPayload,
  StateAddress,
  StateWallet,
} from '@minotaur-ergo/types';

import {
  addressEntityToAddressState,
  walletEntityToWalletState,
} from '@/utils/convert';

import { AddressDbAction, AddressValueDbAction, WalletDbAction } from './db';

const getInitializeData = async (): Promise<InitializeAllPayload> => {
  const dbWallets = await WalletDbAction.getInstance().getWallets();
  const dbAddresses = await AddressDbAction.getInstance().getAllAddresses();
  const balances = await AddressValueDbAction.getInstance().getAllBalances();
  const addresses: Array<StateAddress> = dbAddresses.map(
    addressEntityToAddressState,
  );
  const wallets: Array<StateWallet> = dbWallets.map(walletEntityToWalletState);
  const addressBalance: AddressBalanceMap = {};
  balances.forEach((balance) => {
    if (balance.address) {
      const row: AddressBalance = addressBalance[balance.address.address] || {
        amount: '0',
        tokens: [],
      };
      if (balance.token_id === '') {
        row.amount = (BigInt(row.amount) + balance.amount).toString();
      } else {
        let tokenExists = false;
        row.tokens.forEach((token) => {
          if (token.tokenId === balance.token_id) {
            tokenExists = true;
            token.balance = (BigInt(token.balance) + balance.amount).toString();
          }
        });
        if (!tokenExists) {
          row.tokens.push({
            tokenId: balance.token_id,
            balance: balance.amount.toString(),
          });
        }
      }
      addressBalance[balance.address.address] = row;
    }
  });
  return {
    addresses,
    wallets,
    balances: addressBalance,
  };
};

export { getInitializeData };
