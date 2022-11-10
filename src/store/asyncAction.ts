import { REFRESH_INTERVAL } from '../util/const';
import { NETWORK_TYPES } from '../util/network_type';
import {
  AddressDbAction,
  AssetDbAction,
  BoxContentDbAction,
  BoxDbAction,
} from '../action/db';
import { store } from './index';
import * as actionType from './actionType';
import { ErgoBox } from '../util/network/models';
import { JsonBI } from '../util/json';
import { syncAddress } from '../action/sync/index';

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
    for (const NETWORK_TYPE of NETWORK_TYPES) {
      const addresses = await AddressDbAction.getAllAddressOfNetworkType(
        NETWORK_TYPE.label
      );
      if (addresses.length > 0) {
        try {
          for (const address of addresses) {
            store.dispatch({
              type: actionType.SET_LOADING_WALLET,
              payload: address.wallet?.id,
            });
            await syncAddress(address);
          }
          store.dispatch({
            type: actionType.INVALIDATE_WALLETS,
            payload: { removeLoadingWallet: true },
          });
        } catch (e) {
          console.error(e);
        }
      }
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
