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
      await AddressDbAction.setAddressHeight(address.id, forkPoint);
    } else {
      await syncTxs.syncTxsWithAddress(currentHeight + 1);
    }
  } catch (e) {
    console.error(e);
  }
  const addressInDb = await AddressDbAction.getAddress(address.id);
  if (addressInDb) {
    const expected = await syncTxs.explorer.getConfirmedBalanceByAddress(
      address.address
    );
    const lastReceivedBlock: Block = await syncTxs.node.getLastBlockHeader();
    if (lastReceivedBlock.height == addressInDb.process_height) {
      const lastDbBlockHeader = (await BlockDbAction.getLastHeaders(1))?.pop();
      const successfullySynced = await syncTxs.verifyContent(expected);
      console.log(
        `loading status is ${successfullySynced} for address ${address.address}`
      );
      if (!successfullySynced && lastDbBlockHeader) {
        console.log(lastDbBlockHeader, lastReceivedBlock);
        if (
          lastDbBlockHeader.id == lastReceivedBlock.id &&
          lastReceivedBlock.height == lastReceivedBlock.height
        ) {
          console.log(`forking for address ${address.address}`);
          await DbTransaction.forkAddress(address);
        }
      }
    }
  }
};
