import { SyncTxs } from './SyncTxs';
import { SyncBlocks } from './SyncBlocks';
import { AddressDbAction } from '../db';

/**
 * Sync Process: sync blocks of address 's network and then sync the transactions.
 * @param walletId : number
 */
export const sync = async (walletId: number) => {
  const allAddresses = await AddressDbAction.getWalletAddresses(walletId);
  for (const address of allAddresses) {
    const currentHeight = address.process_height;
    const networkType = address.network_type;

    const syncBlocks = new SyncBlocks(networkType);
    syncBlocks.update(address.process_height);

    const syncTxs = new SyncTxs(address, networkType);
    await syncTxs.syncTrxsWithAddress(currentHeight);
  }
};
