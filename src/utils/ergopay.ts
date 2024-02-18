import { ErgoPayResponse, InternalBoxLoadedData } from '@/types/ergopay';
import { ADDRESS_PLACE_HOLDER } from './const';
import axios from 'axios';
import * as wasm from 'ergo-lib-wasm-browser';
import { BoxDbAction } from '@/action/db';
import { StateWallet } from '@/store/reducer/wallet';
import { createEmptyArray } from './functions';
import getChain from './networks';

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

const getData = (url: string, address: string) => {
  return axios
    .get<ErgoPayResponse>(getUrl(url, address))
    .then((res) => res.data);
};

const getDataMultiple = (url: string, addresses: Array<string>) => {
  return axios
    .post(getUrl(url, 'multiple'), addresses, {
      headers: { 'ErgoPay-CanSelectMultipleAddresses': 'supported' },
    })
    .then((res) => res.data);
};

const getInternalBoxes = async (
  boxIds: Array<string>,
): Promise<InternalBoxLoadedData> => {
  const res: InternalBoxLoadedData = {};
  let index = 0;
  for (const boxId of boxIds) {
    const fetchedBoxes = await BoxDbAction.getInstance().getAllBoxById(boxId);
    for (const box of fetchedBoxes) {
      if (box.address && box.address.wallet) {
        const walletId = box.address.wallet.id.toString();
        if (!Object.prototype.hasOwnProperty.call(res, walletId)) {
          if (index > 0) {
            res[walletId] = createEmptyArray(index, undefined);
          } else {
            res[walletId] = [];
          }
        }
        res[walletId].push(
          wasm.ErgoBox.sigma_parse_bytes(Buffer.from(box.serialized, 'base64')),
        );
      }
    }
    index += 1;
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
