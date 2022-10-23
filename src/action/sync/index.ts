import { SyncTxs } from './SyncTxs';
import { SyncBlocks } from './SyncBlocks';
import { AddressDbAction, BlockDbAction } from '../db';
import { Block } from './../Types';

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
    const startBlock = await BlockDbAction.getBlockByHeight(
      address.process_height,
      address.network_type
    );
    syncBlocks.update(address.process_height);

    const syncTxs = new SyncTxs(address, networkType);
    await syncTxs.syncTrxsWithAddress(currentHeight);
    try {
      await syncTxs.verifyContent();
    } catch (error) {
      if (startBlock != null) {
        if (!syncBlocks.checkFork(startBlock as Block))
          AddressDbAction.setAddressHeight(address.id, startBlock.height);
      }
    }
  }
};
