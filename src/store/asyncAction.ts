import { REFRESH_INTERVAL } from '../util/const';
import {
  AddressDbAction,
  AssetDbAction,
  BoxContentDbAction,
  BoxDbAction,
  DbTransaction,
  WalletDbAction,
} from '../action/db';
import { store } from './index';
import * as actionType from './actionType';
import { ErgoBox } from '../util/network/models';
import { JsonBI } from '../util/json';
import { syncAddress, VerifyAddressContent } from '../action/sync';
import { BlockChainAction } from '../action/blockchain';

const loadTokensAsync = async (network_type: string) => {
  try {
    const tokens = await BoxContentDbAction.getTokens(network_type);
    const assets = (await AssetDbAction.getAllAsset(network_type)).map(
      (item) => item.asset_id
    );
    for (const token of tokens) {
      if (assets.indexOf(token) === -1) {
        await BlockChainAction.updateTokenInfo(token, network_type);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const validateBoxContentModel = async () => {
  const invalidBoxes = await BoxDbAction.invalidAssetCountBox();
  for (const box of invalidBoxes) {
    const boxEntity = await BoxDbAction.getBoxById(box.id);
    if (boxEntity) {
      const boxJson: ErgoBox = JsonBI.parse(boxEntity.json);
      for (const token of boxJson.assets) {
        await BoxContentDbAction.createOrUpdateBoxContent(boxEntity, token);
      }
    }
  }
};

const loadBlockChainDataAsync = async () => {
  try {
    for (const wallet of await WalletDbAction.getWallets()) {
      store.dispatch({
        type: actionType.SET_LOADING_WALLET,
        payload: wallet.id,
      });
      for (const address of await AddressDbAction.getWalletAddresses(
        wallet.id
      )) {
        try {
          await syncAddress(address);
          if (!(await VerifyAddressContent(address.id))) {
            await DbTransaction.forkAddress(address);
          }
          await loadTokensAsync(address.network_type);
        } catch (e) {
          console.error(e);
        }
      }
      store.dispatch({
        type: actionType.INVALIDATE_WALLETS,
        payload: { removeLoadingWallet: true },
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const loadBlockChainData = () => {
  loadBlockChainDataAsync().then(() => {
    store.dispatch({ type: actionType.INVALIDATE_WALLETS });
    setTimeout(() => loadBlockChainData(), REFRESH_INTERVAL);
  });
};

export { loadBlockChainData, validateBoxContentModel };
