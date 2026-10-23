import * as wasm from '@minotaur-ergo/ergo-lib';
import { CapacitorHttp } from '@minotaur-ergo/http';
import {
  ErgoPayResponse,
  InternalBoxLoadedData,
  StateWallet,
} from '@minotaur-ergo/types';
import { createEmptyArray, getChain } from '@minotaur-ergo/utils';

import { BoxDbAction } from '@/action/db';

import { ADDRESS_PLACE_HOLDER } from './const';

const getUrl = (url: string, address: string) => {
  if (url.startsWith('ergopay://localhost')) {
    return url
      .replace('ergopay://', 'http://')
      .replace(ADDRESS_PLACE_HOLDER, address);
  }
  return url
    .replace('ergopay://', 'https://')
    .replace(ADDRESS_PLACE_HOLDER, address);
};

const getData = async (url: string, address: string) => {
  const res = await CapacitorHttp.get({
    url: getUrl(url, address),
  });
  if (res.status / 100 === 2) {
    return res.data as ErgoPayResponse;
  }
  throw Error(`Api Call respond with status code ${res.status}: ${res.data}`);
};

const getDataMultiple = async (url: string, addresses: Array<string>) => {
  const res = await CapacitorHttp.get({
    url: getUrl(url, 'multiple'),
    data: addresses,
    headers: { 'ErgoPay-CanSelectMultipleAddresses': 'supported' },
  });
  if (res.status / 100 === 2) {
    return res.data as ErgoPayResponse;
  }
  throw Error(`Api Call respond with status code ${res.status}: ${res.data}`);
};

const getInternalBoxes = async (
  boxIds: Array<string>,
): Promise<InternalBoxLoadedData> => {
  const res: InternalBoxLoadedData = {};
  const indexes = new Map<string, number>();
  boxIds.forEach((boxId, index) => indexes.set(boxId, index));
  const fetchedBoxes = await BoxDbAction.getInstance().getAllBoxesByIds(boxIds);
  for (const box of fetchedBoxes) {
    const index = indexes.get(box.box_id);
    if (index !== undefined && box.address && box.address.wallet) {
      const walletId = box.address.wallet.id.toString();
      if (!Object.prototype.hasOwnProperty.call(res, walletId)) {
        res[walletId] = createEmptyArray(boxIds.length, undefined);
      }
      res[walletId][index] = wasm.ErgoBox.sigma_parse_bytes(
        Buffer.from(box.serialized, 'base64'),
      );
    }
  }
  return res;
};

const fetchBoxesFromNetwork = async (
  boxIds: Array<string>,
  boxes: Array<wasm.ErgoBox | undefined>,
  wallet: StateWallet,
): Promise<Array<wasm.ErgoBox>> => {
  const network = getChain(wallet.networkType).getNetwork();
  const res: Array<wasm.ErgoBox> = [];
  for (let index = 0; index < boxIds.length; index++) {
    const localBox = boxes[index];
    if (localBox === undefined) {
      const netBox = await network.getBoxById(boxIds[index]);
      if (netBox === undefined) {
        throw Error(`can not fetch box from blockchain ${boxIds[index]}`);
      }
      res.push(netBox);
    } else {
      res.push(localBox);
    }
  }
  return res;
};

export {
  getUrl,
  getData,
  getDataMultiple,
  getInternalBoxes,
  fetchBoxesFromNetwork,
};
