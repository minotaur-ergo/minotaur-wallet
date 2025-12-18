import { AbstractNetwork, StateWallet } from '@minotaur-ergo/types';
import { createEmptyArrayWithIndex, getChain } from '@minotaur-ergo/utils';

import Address from '@/db/entities/Address';
import { AddressValueType } from '@/db/entities/AddressValueInfo';
import store from '@/store';
import { setBalances } from '@/store/reducer/wallet';
import { CONFIRMATION_HEIGHT } from '@/utils/const';

import { deserialize } from './box';
import {
  AddressDbAction,
  AddressValueDbAction,
  AssetDbAction,
  BoxDbAction,
} from './db';

const syncInfo = async (network: AbstractNetwork, address: Address) => {
  const info = await network.getAddressInfo(address.address);
  // Store fetched info
  await AddressValueDbAction.getInstance().insertBalance(
    '',
    info.nanoErgs,
    AddressValueType.Confirmed,
    address,
  );
  const oldTokens = await AddressValueDbAction.getInstance().getAddressBalances(
    address.id,
  );
  const toBeRemovedTokens = new Set(oldTokens.map((item) => item.token_id));
  for (const token of info.tokens) {
    await AddressValueDbAction.getInstance().insertBalance(
      token.id,
      token.amount,
      AddressValueType.Confirmed,
      address,
    );
    toBeRemovedTokens.delete(token.id);
    await AssetDbAction.getInstance().createOrUpdateAsset(
      {
        id: token.id,
        height: 0,
      },
      address.network_type,
    );
  }
  toBeRemovedTokens.delete('');
  for (const tokenId of toBeRemovedTokens) {
    await AddressValueDbAction.getInstance().insertBalance(
      tokenId,
      0n,
      AddressValueType.Confirmed,
      address,
    );
  }
  // check is changed
  const changed = () => {
    if (
      Object.prototype.hasOwnProperty.call(
        store.getState().wallet.balances,
        address.address,
      )
    ) {
      const oldBalance = store.getState().wallet.balances[address.address];
      if (BigInt(oldBalance.amount) !== info.nanoErgs) {
        return true;
      }
      const sortedNewTokens = [...info.tokens].sort((a, b) =>
        a.id.localeCompare(b.id),
      );
      const sortedOldTokens = [...oldBalance.tokens].sort((a, b) =>
        a.tokenId.localeCompare(b.tokenId),
      );
      if (sortedNewTokens.length !== sortedOldTokens.length) return true;
      for (let index = 0; index < sortedNewTokens.length; index++) {
        if (sortedNewTokens[index].id !== sortedOldTokens[index].tokenId)
          return true;
        if (
          sortedNewTokens[index].amount.toString() !==
          sortedOldTokens[index].balance
        )
          return true;
      }
      return false;
    }
    return true;
  };
  if (changed()) {
    store.dispatch(
      setBalances({
        address: address.address,
        balance: {
          amount: info.nanoErgs.toString(),
          tokens: info.tokens.map((token) => ({
            tokenId: token.id,
            balance: token.amount.toString(),
          })),
        },
      }),
    );
  }
};

const storeAssetDetails = async (
  assetId: string,
  networkType: string,
  network?: AbstractNetwork,
) => {
  if (network === undefined) {
    network = getChain(networkType).getNetwork();
  }
  const details = await network.getAssetDetails(assetId);
  await AssetDbAction.getInstance().createOrUpdateAsset(details, networkType);
};

const syncAssets = async (
  network: AbstractNetwork,
  networkType: string,
  height: number,
) => {
  const unknownAssets =
    await AssetDbAction.getInstance().getUnFetchedAssets(networkType);
  const unconfirmedAssets =
    await AssetDbAction.getInstance().getUnConfirmedAssets(
      networkType,
      height - CONFIRMATION_HEIGHT,
    );
  const assets = [...unknownAssets, ...unconfirmedAssets];
  for (const asset of assets) {
    await storeAssetDetails(asset.asset_id, networkType, network);
  }
};

const verifyAddress = async (addressId: number) => {
  const balances =
    await AddressValueDbAction.getInstance().getAddressBalances(addressId);
  const balanceMap = new Map<string, bigint>();
  const boxes = await BoxDbAction.getInstance().getAddressUnspentBoxes([
    addressId,
  ]);
  balances.forEach((balance) => {
    balanceMap.set(
      balance.token_id,
      balanceMap.get(balance.token_id) ?? 0n + balance.amount,
    );
  });
  boxes.forEach((box) => {
    const ergoBox = deserialize(box.serialized);
    const value = BigInt(ergoBox.value().as_i64().to_str());
    balanceMap.set('', (balanceMap.get('') ?? 0n) - value);
    const tokens = ergoBox.tokens();
    createEmptyArrayWithIndex(tokens.len()).forEach((index) => {
      const token = tokens.get(index);
      const tokenId = token.id().to_str();
      const amount = BigInt(token.amount().as_i64().to_str());
      balanceMap.set(tokenId, (balanceMap.get(tokenId) ?? 0n) - amount);
    });
  });
  if (
    Array.from(balanceMap.keys()).some((item) => balanceMap.get(item) !== 0n)
  ) {
    console.warn(
      `address balance incompatible with address boxes. reset address. addressId: [${addressId}]`,
    );
    await BoxDbAction.getInstance().deleteBoxForAddress(addressId);
    await AddressDbAction.getInstance().updateAddressHeight(addressId, 0);
  }
};

const syncWallet = async (
  wallet: StateWallet,
  syncWithNode: boolean,
  url: string,
) => {
  const chain = getChain(wallet.networkType);
  const network = syncWithNode ? chain.getNodeNetwork(url) : chain.getNetwork();
  const height = await network.getHeight();
  const addresses = await AddressDbAction.getInstance().getWalletAddresses(
    wallet.id,
  );
  try {
    await Promise.all(
      addresses.map(async (address) => {
        await syncInfo(network, address);
      }),
    );
  } catch (e) {
    console.log(e);
  }
  await Promise.all(
    addresses.map(async (address) => {
      try {
        const syncResult = await network.syncBoxes(
          address.address,
          address.process_height,
          (newHeight) =>
            AddressDbAction.getInstance().updateAddressHeight(
              address.id,
              newHeight,
            ),
          (info) => BoxDbAction.getInstance().insertOrUpdateBox(info, address),
          (boxId, details) =>
            BoxDbAction.getInstance().spendBox(boxId, details),
        );
        if (syncResult) {
          const verifyHeight = await network.getHeight();
          const dbAddresses =
            await AddressDbAction.getInstance().getAddressById(address.id);
          if (
            dbAddresses.length > 0 &&
            dbAddresses[0].process_height === verifyHeight
          ) {
            await verifyAddress(address.id);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
  await syncAssets(network, wallet.networkType, height);
};

export { syncWallet, storeAssetDetails };
