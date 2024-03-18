import Address from '@/db/entities/Address';
import { AddressValueType } from '@/db/entities/AddressValueInfo';
import Wallet from '@/db/entities/Wallet';
import store from '@/store';
import { setBalances } from '@/store/reducer/wallet';
import { CONFIRMATION_HEIGHT } from '@/utils/const';
import getChain from '@/utils/networks';
import { AbstractNetwork } from '@/utils/networks/abstractNetwork';
import {
  AddressDbAction,
  AddressValueDbAction,
  AssetDbAction,
  BoxDbAction,
} from './db';
import { deserialize } from './box';
import { createEmptyArrayWithIndex } from '@/utils/functions';

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
    const details = await network.getAssetDetails(asset.asset_id);
    await AssetDbAction.getInstance().createOrUpdateAsset(details, networkType);
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
    BoxDbAction.getInstance().deleteBoxForAddress(addressId);
    AddressDbAction.getInstance().updateAddressHeight(addressId, 0);
  }
};

const syncWallet = async (wallet: Wallet) => {
  const chain = getChain(wallet.network_type);
  const network = chain.getNetwork();
  const height = await chain.getNetwork().getHeight();
  const addresses = await AddressDbAction.getInstance().getWalletAddresses(
    wallet.id,
  );
  for (const address of addresses) {
    try {
      await syncInfo(network, address);
    } catch (e) {
      console.log(e);
    }
  }
  for (const address of addresses) {
    try {
      if (await network.syncBoxes(address)) {
        const verifyHeight = await network.getHeight();
        const dbAddresses = await AddressDbAction.getInstance().getAddressById(
          address.id,
        );
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
  }
  await syncAssets(network, wallet.network_type, height);
};

export { syncWallet };
