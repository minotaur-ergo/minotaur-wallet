import { SyncTxs } from './SyncTxs';
import { SyncBlocks } from './SyncBlocks';
import { AddressDbAction, BlockDbAction, DbTransaction } from '../db';
import { Block } from './../Types';
import Address from '../../db/entities/Address';

/**
 * Sync Process: sync given address and its network_type.
 * @param address: Address
 */
export const syncAddress = async (address: Address) => {
  const syncBlocks = new SyncBlocks(address.network_type);

  const currentHeight = address.process_height;
  const networkType = address.network_type;

  const syncTxs = new SyncTxs(address, networkType);

  try {
    const forkPoint = await syncBlocks.update();
    if (forkPoint !== undefined) {
      await DbTransaction.forkAll(forkPoint, address.network_type);
      AddressDbAction.setAddressHeight(address.id, forkPoint);
    }
    await syncTxs.syncTrxsWithAddress(currentHeight);
  } catch (e) {
    console.error(e);
  }

  const lastRecievedBlock: Block = await syncTxs.node.getLastBlockHeader();
  const lastDbBlockHeader = (await BlockDbAction.getLastHeaders(1))!.pop();
  const successfullySynced = await syncTxs.verifyContent();
  if (!successfullySynced) {
    if (lastDbBlockHeader == lastRecievedBlock)
      AddressDbAction.setAddressHeight(address.id, 0);
    await DbTransaction.forkAddress(address);
  }
};
