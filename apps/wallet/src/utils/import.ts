import {
  DerivedWalletAddress,
  RestoreWalletWithSelection,
  WalletType,
} from '@minotaur-ergo/types';
import { deriveAddressFromXPub, getChain } from '@minotaur-ergo/utils';

import {
  addWalletAddresses,
  deriveMultiSigWalletAddress,
} from '@/action/address';
import { MultiSigDbAction, WalletDbAction } from '@/action/db';
import { walletEntityToWalletState } from '@/utils/convert';

const importNormalWallet = async (wallet: RestoreWalletWithSelection) => {
  const addressesToProcess = new Set(wallet.addresses || []);
  const addresses: Array<DerivedWalletAddress> = [];
  const chain = getChain(wallet.network);
  let index = 0;

  while (addressesToProcess.size > 0 && index < 100) {
    const newAddress = deriveAddressFromXPub(wallet.xPub, chain.prefix, index);
    if (addressesToProcess.has(newAddress.address)) {
      addresses.push({
        address: newAddress.address,
        path: newAddress.path,
        index: index,
      });
      addressesToProcess.delete(newAddress.address);
    }
    index++;
  }

  const inserted = await WalletDbAction.getInstance().createWallet(
    wallet.name,
    wallet.type,
    wallet.seed,
    wallet.xPub,
    wallet.network,
    wallet.requiredSign ?? 1,
    wallet.mnemonic || '',
  );

  await addWalletAddresses(walletEntityToWalletState(inserted), addresses);
  return inserted;
};

const importMultiSigWallet = async (wallet: RestoreWalletWithSelection) => {
  const addressesToProcess = new Set(wallet.addresses || []);
  const addresses: Array<DerivedWalletAddress> = [];

  const inserted = await WalletDbAction.getInstance().createWallet(
    wallet.name,
    wallet.type,
    wallet.seed,
    wallet.xPub,
    wallet.network,
    wallet.requiredSign ?? 1,
    wallet.mnemonic || '',
  );

  if (wallet.signers) {
    for (const signerKey of wallet.signers) {
      await MultiSigDbAction.getInstance().createKey(inserted, signerKey, null);
    }
  }

  const walletState = walletEntityToWalletState(inserted);

  let index = 0;
  while (addressesToProcess.size > 0 && index < 100) {
    const derivedAddress = await deriveMultiSigWalletAddress(
      walletState,
      index,
    );
    if (addressesToProcess.has(derivedAddress.address)) {
      addresses.push({
        address: derivedAddress.address,
        path: derivedAddress.path,
        index: derivedAddress.index,
      });
      addressesToProcess.delete(derivedAddress.address);
    }
    index++;
  }

  await addWalletAddresses(walletState, addresses);
  return inserted;
};

const importWallet = async (wallet: RestoreWalletWithSelection) => {
  if (wallet.selected) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
  switch (wallet.type) {
    case WalletType.Normal:
    case WalletType.ReadOnly:
      return await importNormalWallet(wallet);
    case WalletType.MultiSig:
      return await importMultiSigWallet(wallet);
    default:
      throw new Error(`Unsupported wallet type: ${wallet.type}`);
  }
};

export { importWallet, importNormalWallet, importMultiSigWallet };
