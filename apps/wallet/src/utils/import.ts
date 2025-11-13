import {
  DerivedWalletAddress,
  ExportWallet,
  ImportProcessingState,
  RestoreWalletFlags,
  RestoreWalletWithSelection,
  WalletType,
} from '@minotaur-ergo/types';
import { deriveAddressFromXPub, getChain } from '@minotaur-ergo/utils';

import {
  addWalletAddresses,
  deriveMultiSigWalletAddress,
} from '@/action/address';
import { AddressDbAction, MultiSigDbAction, WalletDbAction } from '@/action/db';
import Address from '@/db/entities/Address';
import Wallet from '@/db/entities/Wallet';
import { walletEntityToWalletState } from '@/utils/convert';

const importNormalWallet = async (wallet: ExportWallet, oldId?: number) => {
  const addressesToProcess = new Map<string, string>();
  wallet.addresses?.forEach((address) => {
    const parts = address.split('#');
    addressesToProcess.set(parts[0], parts.length > 1 ? parts[1] : '');
  });
  const addresses: Array<DerivedWalletAddress> = [];
  const chain = getChain(wallet.network);
  let index = 0;

  while (addressesToProcess.size > 0 && index < 100) {
    const newAddress = deriveAddressFromXPub(wallet.xPub, chain.prefix, index);
    if (addressesToProcess.has(newAddress.address)) {
      const name = addressesToProcess.get(newAddress.address);
      const addressRow: DerivedWalletAddress = {
        address: newAddress.address,
        path: newAddress.path,
        index: index,
        name: name === '' ? undefined : name,
      };
      addresses.push(addressRow);
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
    oldId,
  );
  const insertedAddresses = new Set(
    (await AddressDbAction.getInstance().getWalletAddresses(inserted.id)).map(
      (item) => item.address,
    ),
  );
  const addressesToImport = addresses.filter(
    (element) => !insertedAddresses.has(element.address),
  );
  if (addressesToImport.length > 0) {
    await addWalletAddresses(
      walletEntityToWalletState(inserted),
      addressesToImport,
    );
  }
  return inserted;
};

const importMultiSigWallet = async (wallet: ExportWallet) => {
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
      let related: Wallet | null = null;
      if (signerKey.startsWith('+')) {
        const all_related = await WalletDbAction.getInstance().getWalletByXPub(
          signerKey.slice(1),
        );
        if (all_related.length > 0) {
          related = all_related[0];
        }
      }
      await MultiSigDbAction.getInstance().createKey(
        inserted,
        signerKey.slice(1),
        related,
      );
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

const importWallet = async (restore: RestoreWalletWithSelection) => {
  if (restore.selected) {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
  switch (restore.wallet.type) {
    case WalletType.Normal:
    case WalletType.ReadOnly:
      return await importNormalWallet(
        restore.wallet,
        restore.flags.convert?.id,
      );
    case WalletType.MultiSig:
      return await importMultiSigWallet(restore.wallet);
    default:
      throw new Error(`Unsupported wallet type: ${restore.wallet.type}`);
  }
};

const getDuplicateMultiSig = async (
  wallet: ExportWallet,
  wallets: Array<Wallet>,
): Promise<Wallet | undefined> => {
  if (wallet.type === WalletType.MultiSig && wallet.signers) {
    const filtered = wallets.filter(
      (item) =>
        item.type === WalletType.MultiSig &&
        item.network_type === wallet.network,
    );
    const signerKeysSorted = [...wallet.signers.map((item) => item.slice(1))]
      .sort()
      .join(',');
    for (const item of filtered) {
      if (wallet.requiredSign === item.required_sign) {
        const keys = (
          await MultiSigDbAction.getInstance().getWalletKeys(item.id)
        )
          .map((item) => item.extended_key)
          .sort()
          .join(',');
        if (keys === signerKeysSorted) {
          return item;
        }
      }
    }
  }
};

const getDuplicateNormal = async (
  wallet: ExportWallet,
  wallets: Array<Wallet>,
): Promise<Wallet | undefined> => {
  if (wallet.type === WalletType.Normal) {
    const filtered = wallets.filter(
      (item) =>
        [WalletType.Normal, WalletType.ReadOnly].includes(item.type) &&
        item.network_type === wallet.network,
    );
    for (const item of filtered) {
      if (item.extended_public_key === wallet.xPub) {
        return item;
      }
    }
  }
};

const getDuplicateReadOnly = async (
  wallet: ExportWallet,
  wallets: Array<Wallet>,
  addresses: Array<Address>,
): Promise<Wallet | undefined> => {
  if (wallet.type === WalletType.ReadOnly) {
    const filtered = wallets.filter(
      (item) =>
        [WalletType.Normal, WalletType.ReadOnly].includes(item.type) &&
        item.network_type === wallet.network,
    );
    if (wallet.xPub) {
      for (const item of filtered) {
        if (item.extended_public_key === wallet.xPub) {
          return item;
        }
      }
    } else {
      let res: Wallet | undefined = undefined;
      addresses.forEach((item) => {
        if (
          item.wallet &&
          wallet.addresses?.some((addr) => item.address === addr.split('#')[0])
        ) {
          res = item.wallet;
        }
      });
      return res;
    }
  }
};

const getDuplicate = async (
  wallet: ExportWallet,
  addresses: Array<Address>,
  wallets: Array<Wallet>,
): Promise<Wallet | undefined> => {
  switch (wallet.type) {
    case WalletType.MultiSig:
      return getDuplicateMultiSig(wallet, wallets);
    case WalletType.Normal:
      return getDuplicateNormal(wallet, wallets);
    case WalletType.ReadOnly:
      return getDuplicateReadOnly(wallet, wallets, addresses);
  }
};
const getDuplicateFlag = async (
  wallet: ExportWallet,
  addresses: Array<Address>,
  wallets: Array<Wallet>,
): Promise<RestoreWalletFlags> => {
  const duplicate = await getDuplicate(wallet, addresses, wallets);
  if (duplicate) {
    if (
      wallet.type === WalletType.Normal &&
      duplicate.type === WalletType.ReadOnly
    ) {
      return {
        convert: {
          name: duplicate.name,
          id: duplicate.id,
        },
      };
    } else {
      return {
        duplicate: {
          name: duplicate.name,
          id: duplicate.id,
        },
      };
    }
  }

  return {};
};

const getMultiSigFlag = async (
  wallet: ExportWallet,
  data: Array<ExportWallet>,
  wallets: Array<Wallet>,
): Promise<RestoreWalletFlags> => {
  if (wallet.type === WalletType.MultiSig) {
    let signerFound = false;
    data
      .filter((item) => item.type !== WalletType.MultiSig)
      .forEach((item) => {
        if (wallet.signers?.includes('+' + item.xPub)) {
          signerFound = true;
        }
      });
    if (!signerFound) {
      wallets
        .filter((item) => item.type !== WalletType.MultiSig)
        .forEach((item) => {
          if (wallet.signers?.includes('+' + item.extended_public_key)) {
            signerFound = true;
          }
        });
    }
    if (!signerFound) {
      return {
        noSignerWallet: true,
      };
    }
  }
  return {};
};

const checkForProblems = async (
  data: Array<ExportWallet>,
): Promise<Array<RestoreWalletWithSelection>> => {
  const addresses = await AddressDbAction.getInstance().getAllAddresses();
  const wallets = await WalletDbAction.getInstance().getWallets();
  return await Promise.all(
    data.map(async (importWallet) => {
      return {
        wallet: importWallet,
        selected: false,
        selectable: true,
        status: ImportProcessingState.Pending,
        flags: {
          ...(await getDuplicateFlag(importWallet, addresses, wallets)),
          ...(await getMultiSigFlag(importWallet, data, wallets)),
        },
      };
    }),
  );
};

export {
  importWallet,
  importNormalWallet,
  importMultiSigWallet,
  checkForProblems,
};
