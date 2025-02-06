import { DataSource, Repository } from 'typeorm';
import Address from '../db/entities/Address';
import AddressValueInfo, {
  AddressValueType,
} from '@/db/entities/AddressValueInfo';
import Asset from '@/db/entities/Asset';
import Box from '@/db/entities/Box';
import Config, { ConfigType } from '@/db/entities/Config';
import MultiCommitment from '@/db/entities/multi-sig/MultiCommitment';
import MultiSigner, {
  MultiSigSignerType,
} from '@/db/entities/multi-sig/MultiSigner';
import MultiSignInput from '@/db/entities/multi-sig/MultiSignInput';
import MultiSignRow from '@/db/entities/multi-sig/MultiSignRow';
import MultiSignTx, {
  MultiSigTxType,
} from '@/db/entities/multi-sig/MultiSignTx';
import MultiSigKey from '@/db/entities/MultiSigKey';
import SavedAddress from '@/db/entities/SavedAddress';
import Wallet, { WalletType } from '@/db/entities/Wallet';
import { BoxInfo, TokenInfo, TxInfo } from '@/types/db';
import { SpendDetail } from '@/types/network';
import store from '@/store';
import { invalidateWallets } from '@/store/reducer/wallet';
import { DEFAULT_ADDRESS_PREFIX, TX_CHUNK_SIZE } from '@/utils/const';
import { sliceToChunksString } from '@/utils/functions';

class WalletDbAction {
  private walletRepository: Repository<Wallet>;
  private static instance: WalletDbAction;

  private constructor(dataSource: DataSource) {
    this.walletRepository = dataSource.getRepository(Wallet);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    WalletDbAction.instance = new WalletDbAction(dataSource);
  };

  getWallets = async () => {
    return await this.walletRepository.find();
  };

  getWalletById = async (walletId: number) => {
    return this.walletRepository.findOneBy({ id: walletId });
  };

  createWallet = async (
    name: string,
    type: WalletType,
    seed: string,
    extended_public_key: string,
    network_type: string,
    requiredSign: number,
    encryptedMnemonic: string,
  ) => {
    const wallet = {
      name: name,
      type: type,
      seed: seed,
      extended_public_key: extended_public_key,
      network_type: network_type,
      required_sign: requiredSign,
      encrypted_mnemonic: encryptedMnemonic,
    };
    await this.walletRepository.save(wallet);
    const res = await this.walletRepository.findOneBy({
      name: name,
      type: type,
      seed: seed,
      extended_public_key: extended_public_key,
      network_type: network_type,
      required_sign: requiredSign,
      encrypted_mnemonic: encryptedMnemonic,
    });
    if (!res) throw Error('Can not store wallet');
    return res;
  };

  setWalletName = async (walletId: number, newName: string) => {
    await this.walletRepository
      .createQueryBuilder()
      .update()
      .set({ name: newName })
      .where('id=:id', { id: walletId })
      .execute();
    store.dispatch(invalidateWallets());
  };

  deleteWallet = async (walletId: number) => {
    await AddressDbAction.getInstance().deleteWalletAddresses(walletId);
    const entity = await this.getWalletById(walletId);
    if (entity) {
      if (entity.type === WalletType.MultiSig) {
        await MultiSigDbAction.getInstance().deleteWalletKeys(entity.id);
      }
      await this.walletRepository
        .createQueryBuilder()
        .delete()
        .where('id=:id', { id: walletId })
        .execute();
      await ConfigDbAction.getInstance().deleteConfig(ConfigType.ActiveWallet);
      store.dispatch(invalidateWallets());
    }
  };

  protected setFlags = async (walletId: number, flags: Array<string>) => {
    const flagStr = [
      ...new Set(flags.filter(Boolean).map((item) => item.trim())),
    ].join('|');
    await this.walletRepository
      .createQueryBuilder()
      .update()
      .set({ flags: flagStr })
      .where('id=:id', { id: walletId })
      .execute();
  };

  setFlagOnWallet = async (
    walletId: number,
    flag: string,
    remove: boolean = false,
  ) => {
    const wallet = await this.getWalletById(walletId);
    if (wallet) {
      const flags = [...wallet.flags.split('|'), flag].filter(
        (item) => !remove || item !== flag,
      );
      await this.setFlags(walletId, flags);
      store.dispatch(invalidateWallets());
    }
  };

  setDefaultAddress = async (walletId: number, index: number) => {
    const wallet = await this.getWalletById(walletId);
    if (wallet) {
      const flags = [
        ...wallet.flags
          .split('|')
          .filter((item) => !item.startsWith(DEFAULT_ADDRESS_PREFIX)),
        DEFAULT_ADDRESS_PREFIX + index,
      ];
      await this.setFlags(walletId, flags);
      store.dispatch(invalidateWallets());
    }
  };
}

class MultiSigDbAction {
  private static instance: MultiSigDbAction;
  private repository: Repository<MultiSigKey>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(MultiSigKey);
  }

  static getInstance = () => {
    if (MultiSigDbAction.instance) {
      return MultiSigDbAction.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    MultiSigDbAction.instance = new MultiSigDbAction(dataSource);
  };

  createKey = async (
    wallet: Wallet,
    key_or_address: string,
    sign_wallet: Wallet | null,
  ) => {
    const entity = {
      wallet: wallet,
      extended_key: key_or_address,
      sign_wallet: sign_wallet,
    };
    return this.repository.insert(entity);
  };

  getWalletInternalKey = async (walletId: number) => {
    const data = await this.repository
      .createQueryBuilder()
      .where('walletId = :walletId', { walletId: walletId })
      .andWhere('signWalletId is not null')
      .getRawOne();
    if (data) {
      return await WalletDbAction.getInstance().getWalletById(
        data.MultiSigKey_signWalletId,
      );
    }
    return undefined;
  };

  getWalletExternalKeys = async (walletId: number) => {
    return await this.repository
      .createQueryBuilder()
      .where('walletId = :walletId', { walletId: walletId })
      .andWhere('signWalletId is null')
      .getMany();
  };

  getWalletKeys = async (walletId: number) => {
    return await this.repository
      .createQueryBuilder()
      .where('walletId = :walletId', { walletId: walletId })
      .getMany();
  };

  deleteWalletKeys = async (walletId: number) => {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .where('walletId = :walletId', { walletId })
      .execute();
  };
}

class AddressDbAction {
  private repository: Repository<Address>;
  private static instance: AddressDbAction;

  private constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Address);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  getLastAddressIndex = async (wallet_id: number): Promise<number> => {
    const queryBuilder = this.repository.createQueryBuilder('lastIndex');
    queryBuilder
      .select('MAX("idx")', 'lastIndex')
      .where(`walletId=${wallet_id}`);
    const res = await queryBuilder.getRawOne();
    return res === undefined ||
      res.lastIndex === undefined ||
      res.lastIndex === null
      ? -1
      : res.lastIndex;
  };

  static initialize = (dataSource: DataSource) => {
    AddressDbAction.instance = new AddressDbAction(dataSource);
  };

  getAllAddresses = async (): Promise<Array<Address>> => {
    return await this.repository.find({
      relations: ['wallet'],
    });
  };

  getWalletAddresses = async (walletId: number) => {
    return this.repository
      .createQueryBuilder()
      .where('walletId=:walletId', { walletId })
      .getMany();
  };

  getAddressById = async (addressId: number) => {
    return await this.repository.findBy({ id: addressId });
  };

  getAddressByAddressString = async (address: string) => {
    return await this.repository.findOneBy({ address: address });
  };

  saveAddress = async (
    walletId: number,
    name: string,
    address: string,
    path: string,
    index: number,
  ) => {
    const wallet = await WalletDbAction.getInstance().getWalletById(walletId);
    if (!wallet) throw Error('invalid wallet id');
    const entity = {
      name: name,
      address: address,
      path: path,
      idx: index,
      network_type: wallet.network_type,
      wallet: wallet,
    };
    return await this.repository.save(entity);
  };

  updateAddressName = async (addressId: number, newName: string) => {
    return await this.repository
      .createQueryBuilder()
      .update()
      .set({ name: newName })
      .where('id=:id', { id: addressId })
      .execute();
  };

  updateAddressHeight = async (addressId: number, newHeight: number) => {
    return await this.repository
      .createQueryBuilder()
      .update()
      .set({ process_height: newHeight })
      .where('id=:id', { id: addressId })
      .execute();
  };

  deleteWalletAddresses = async (walletId: number) => {
    const addresses = await this.repository
      .createQueryBuilder()
      .select()
      .where('walletId = :walletId', { walletId })
      .getMany();
    if (addresses.length > 0) {
      for (const address of addresses) {
        await BoxDbAction.getInstance().deleteBoxForAddress(address.id);
      }
      await this.repository
        .createQueryBuilder()
        .delete()
        .where('walletId = :walletId', { walletId })
        .execute();
    }
  };
}

class AddressValueDbAction {
  private repository: Repository<AddressValueInfo>;
  private static instance: AddressValueDbAction;

  private constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(AddressValueInfo);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    AddressValueDbAction.instance = new AddressValueDbAction(dataSource);
  };

  insertBalance = async (
    tokenId: string,
    amount: bigint,
    type: AddressValueType,
    address: Address,
  ) => {
    const dbEntity = await this.repository
      .createQueryBuilder()
      .select()
      .where(
        'addressId = :addressId AND type = :type AND token_id = :tokenId',
        {
          addressId: address.id,
          tokenId,
          type: AddressValueType.Confirmed,
        },
      )
      .getOne();
    if (dbEntity === null) {
      await this.repository.insert({
        token_id: tokenId,
        address,
        type,
        amount,
      });
    } else {
      await this.repository
        .createQueryBuilder()
        .update()
        .set({ amount })
        .where('id = :id', { id: dbEntity.id })
        .execute();
    }
  };

  deleteBalances = (untilHeight: number) => {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('height < :height', { height: untilHeight })
      .execute();
  };

  getAddressBalances = (addressId: number) => {
    return this.repository
      .createQueryBuilder()
      .select()
      .where('addressId = :addressId', { addressId })
      .getMany();
  };

  getAllBalances = () => {
    return this.repository.find({
      relations: ['address'],
    });
  };
}

class BoxDbAction {
  private repository: Repository<Box>;
  private static instance: BoxDbAction;

  private constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Box);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    BoxDbAction.instance = new BoxDbAction(dataSource);
  };

  spendBox = (boxId: string, spend: SpendDetail) => {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        spend_tx_id: spend.tx,
        spend_timestamp: spend.timestamp,
        spend_index: spend.index,
        spend_height: spend.height,
      })
      .where('box_id = :boxId', { boxId })
      .execute();
  };
  deleteBoxByBoxId = (id: number) => {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  };

  forkTx = async (txId: string) => {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('tx_id=:txId', { txId })
      .execute();
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        spend_height: 0,
        spend_index: 0,
        spend_timestamp: 0,
      })
      .where('spend_tx_id=:txId', { txId })
      .execute();
  };
  getTxBoxes = (
    txId: string,
    addressIds: Array<number>,
  ): Promise<Array<Box>> => {
    return this.repository
      .createQueryBuilder()
      .where(
        'addressId IN (:...addressIds) AND (tx_id = :txId OR spend_tx_id = :txId)',
        { txId, addressIds },
      )
      .getMany();
  };

  getWalletSortedTxIds = (
    walletId: number,
    offset?: number,
    limit?: number,
  ): Promise<Array<{ txId: string; height: number }>> => {
    const createTxs = this.repository
      .createQueryBuilder()
      .select('tx_id', 'txId')
      .addSelect('create_height', 'height')
      .innerJoin('address', 'Address', 'Address.id == box.addressId')
      .where(`address.walletId = ${walletId}`)
      .distinct()
      .getQuery();
    const spendTxs = this.repository
      .createQueryBuilder()
      .select('spend_tx_id', 'txId')
      .addSelect('spend_height', 'height')
      .where('spend_tx_id <> NULL')
      .innerJoin('address', 'Address', 'Address.id == box.addressId')
      .where(`address.walletId = ${walletId}`)
      .andWhere('spend_tx_id IS NOT NULL')
      .distinct()
      .getQuery();
    let query = `SELECT distinct txId, height FROM (${createTxs} UNION ${spendTxs}) ORDER BY height DESC`;
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    if (offset !== undefined) {
      query += ` OFFSET ${offset}`;
    }
    return this.repository.query(query);
  };

  getAddressSortedTxIds = (
    addressId: number,
    fromHeight: number,
  ): Promise<Array<{ txId: string; height: number }>> => {
    const createTxs = this.repository
      .createQueryBuilder()
      .select('tx_id', 'txId')
      .addSelect('create_height', 'height')
      .where(`box.addressId = ${addressId}`)
      .andWhere(`box.create_height >= ${fromHeight}`)
      .distinct()
      .getQuery();
    const spendTxs = this.repository
      .createQueryBuilder()
      .select('spend_tx_id', 'txId')
      .addSelect('spend_height', 'height')
      .where('spend_tx_id <> NULL')
      .where(`box.addressId = ${addressId}`)
      .andWhere(`box.spend_height >= ${fromHeight}`)
      .andWhere('spend_tx_id <> NULL')
      .distinct()
      .getQuery();
    const query = `SELECT distinct txId, height FROM (${createTxs} UNION ${spendTxs}) ORDER BY height DESC`;
    return this.repository.query(query);
  };

  getAddressBoxes = (
    addresses: Array<number>,
    order = 'create_height',
    direction: 'ASC' | 'DESC' = 'ASC',
    boxIds: Array<string> = [],
  ) => {
    const query = this.repository
      .createQueryBuilder()
      .select()
      .where('addressId IN (:...addressIds)', { addressIds: addresses });
    if (boxIds?.length > 0) {
      query.andWhere('box_id IN (:...boxIds)', { boxIds });
    }
    return query.orderBy(order, direction).getMany();
  };

  getAllBoxById = async (boxId: string): Promise<Array<Box>> => {
    return this.repository.find({
      relations: ['address.wallet'],
      where: {
        box_id: boxId,
      },
    });
  };

  getBoxByBoxId = async (
    boxId: string,
    address: Address,
  ): Promise<Box | null> => {
    return this.repository.findOne({
      where: {
        box_id: boxId,
        address: {
          id: address.id,
        },
      },
    });
  };

  insertOrUpdateBox = async (box: BoxInfo, address: Address) => {
    const dbEntity = await this.getBoxByBoxId(box.boxId, address);
    const entity = {
      box_id: box.boxId,
      tx_id: box.create.tx,
      create_index: box.create.index,
      create_height: box.create.height,
      create_timestamp: box.create.timestamp,
      address: address,
      serialized: box.serialized,
      spend_tx_id: box.spend ? box.spend.tx : null,
      spend_height: box.spend ? box.spend.height : 0,
      spend_timestamp: box.spend ? box.spend.timestamp : 0,
      spend_index: box.spend ? box.spend.index : 0,
    };
    if (dbEntity) {
      await this.repository
        .createQueryBuilder()
        .update()
        .set(entity)
        .where('id=:id', { id: dbEntity.id })
        .execute();
    } else {
      await this.repository.insert(entity);
    }
    return await this.getBoxByBoxId(box.boxId, address);
  };

  getAddressUnspentBoxes = async (
    addresses: Array<number>,
    order = 'create_height',
    direction: 'ASC' | 'DESC' = 'ASC',
  ) => {
    return this.repository
      .createQueryBuilder()
      .select()
      .where('addressId IN (:...addressIds) AND spend_tx_id is NULL', {
        addressIds: addresses,
      })
      .orderBy(order, direction)
      .getMany();
  };

  updateBoxDetailForTx = async (txId: string, info: TxInfo) => {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        create_timestamp: info.timestamp,
        create_height: info.height,
      })
      .where('tx_id=:txId', { txId })
      .execute();
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        spend_height: info.height,
        spend_timestamp: info.timestamp,
      })
      .where('spend_tx_id=:txId', { txId })
      .execute();
  };

  deleteBoxForAddress = async (addressId: number) => {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('addressId = :addressId', { addressId })
      .execute();
  };
}

class AssetDbAction {
  private assetRepository: Repository<Asset>;
  private static instance: AssetDbAction;

  private constructor(dataSource: DataSource) {
    this.assetRepository = dataSource.getRepository(Asset);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    this.instance = new AssetDbAction(dataSource);
  };

  getAssetByAssetId = async (
    assetId: string,
    network_type: string,
  ): Promise<Asset | null> => {
    return await this.assetRepository.findOneBy({
      asset_id: assetId,
      network_type: network_type,
    });
  };

  createOrUpdateAsset = async (info: TokenInfo, networkType: string) => {
    const dbEntity = await this.getAssetByAssetId(info.id, networkType);
    const entity = {
      asset_id: info.id,
      box_id: info.boxId,
      tx_id: info.txId ?? undefined,
      emission_amount: info.emissionAmount?.toString() ?? undefined,
      height: info.height,
      name: info.name,
      network_type: networkType,
      description: info.description,
      decimal: info.decimals,
    };
    if (dbEntity) {
      await this.assetRepository
        .createQueryBuilder()
        .update()
        .set(entity)
        .where('id=:id', { id: dbEntity.id })
        .execute();
    } else {
      await this.assetRepository.insert(entity);
    }
    return await this.getAssetByAssetId(info.id, networkType);
  };

  getAllAsset = async (network_type: string) => {
    return await this.assetRepository.findBy({ network_type: network_type });
  };

  getUnFetchedAssets = async (networkType: string) => {
    return this.assetRepository
      .createQueryBuilder()
      .select()
      .where("(tx_id is NULL OR tx_id ='') AND network_type=:networkType", {
        networkType,
      })
      .getMany();
  };

  getUnConfirmedAssets = async (networkType: string, height: number) => {
    return this.assetRepository
      .createQueryBuilder()
      .select()
      .where(
        "tx_id is not NULL AND tx_id <> '' AND network_type=:networkType AND height > :height",
        {
          networkType,
          height,
        },
      )
      .getMany();
  };
}

class ConfigDbAction {
  private repository: Repository<Config>;
  private static instance: ConfigDbAction;

  private constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Config);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    ConfigDbAction.instance = new ConfigDbAction(dataSource);
  };

  getAllConfig = async () => {
    return await this.repository.find();
  };

  setConfig = async (key: string, value: string) => {
    const entity = await this.repository.findOneBy({ key: key });
    if (entity) {
      return await this.repository
        .createQueryBuilder()
        .update()
        .set({ value: value })
        .where('key=:key', { key: key })
        .execute();
    } else {
      return await this.repository.insert({
        key: key,
        value: value,
      });
    }
  };

  deleteConfig = async (key: string) => {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .where('key=:key', { key: key })
      .execute();
  };
}

class SavedAddressDbAction {
  private repository: Repository<SavedAddress>;
  private static instance: SavedAddressDbAction;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SavedAddress);
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    SavedAddressDbAction.instance = new SavedAddressDbAction(dataSource);
  };

  saveNewEntity = async (name: string, address: string) => {
    const saved = await this.repository.findBy({ address: address });
    if (saved.length > 0) {
      throw Error('address already exists');
    } else {
      await this.repository.insert({
        address: address,
        name: name,
      });
    }
  };

  updateEntity = async (id: number, name: string, address?: string) => {
    const saved = await this.repository.findBy({ id: id });
    if (saved) {
      if (address && saved[0].address !== address) {
        const addressExists =
          (await this.repository.findBy({ address: address })).length > 0;
        if (addressExists) {
          throw Error('Address already exists');
        }
      }
      await this.repository
        .createQueryBuilder()
        .update()
        .set({ address: address, name: name })
        .where('id=:id', { id: id })
        .execute();
    }
  };

  deleteEntity = async (id: number) => {
    return await this.repository
      .createQueryBuilder()
      .delete()
      .where('id=:id', { id: id })
      .execute();
  };

  getAllAddresses = async () => {
    return this.repository.find();
  };

  getAddressName = async (address: string) => {
    const elements = await this.repository.findBy({ address: address });
    if (elements.length > 0) {
      return elements[0].name;
    }
    return undefined;
  };
}

class MultiStoreDbAction {
  private commitmentRepository: Repository<MultiCommitment>;
  private signerRepository: Repository<MultiSigner>;
  private inputRepository: Repository<MultiSignInput>;
  private rowRepository: Repository<MultiSignRow>;
  private txRepository: Repository<MultiSignTx>;
  private dataSource: DataSource;

  private static instance: MultiStoreDbAction;

  constructor(dataSource: DataSource) {
    this.commitmentRepository = dataSource.getRepository(MultiCommitment);
    this.signerRepository = dataSource.getRepository(MultiSigner);
    this.inputRepository = dataSource.getRepository(MultiSignInput);
    this.rowRepository = dataSource.getRepository(MultiSignRow);
    this.txRepository = dataSource.getRepository(MultiSignTx);
    this.dataSource = dataSource;
  }

  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    throw Error('Not initialized');
  };

  static initialize = (dataSource: DataSource) => {
    MultiStoreDbAction.instance = new MultiStoreDbAction(dataSource);
  };

  public deleteEntireRow = async (rowId: number) => {
    const row = await this.getRowById(rowId);
    if (row) {
      const queryRunner = this.dataSource.createQueryRunner();
      queryRunner.connect();
      queryRunner.startTransaction();
      try {
        await queryRunner.manager
          .getRepository(MultiSignInput)
          .createQueryBuilder()
          .delete()
          .where({ tx: row })
          .execute();
        await queryRunner.manager
          .getRepository(MultiSignTx)
          .createQueryBuilder()
          .delete()
          .where({ tx: row })
          .execute();
        await queryRunner.manager
          .getRepository(MultiCommitment)
          .createQueryBuilder()
          .delete()
          .where({ tx: row })
          .execute();
        await queryRunner.manager
          .getRepository(MultiSigner)
          .createQueryBuilder()
          .delete()
          .where({ tx: row })
          .execute();
        await queryRunner.manager
          .getRepository(MultiSignRow)
          .createQueryBuilder()
          .delete()
          .where({ id: row.id })
          .execute();
        await queryRunner.commitTransaction();
      } catch (e) {
        queryRunner.rollbackTransaction();
        throw e;
      }
    }
  };

  public insertMultiSigRow = async (walletId: number, txId: string) => {
    const wallet = await WalletDbAction.getInstance().getWalletById(walletId);
    const old = await this.rowRepository
      .createQueryBuilder()
      .select()
      .where('txId=:txId AND walletId=walletId', { txId, walletId: walletId })
      .getOne();
    if (old === null) {
      await this.rowRepository.insert({
        txId: txId,
        wallet: wallet,
      });
    } else {
      await this.rowRepository
        .createQueryBuilder()
        .update()
        .set({ wallet: wallet })
        .where('id=:id', { id: old.id })
        .execute();
    }
    return await this.rowRepository.findOneBy({ txId: txId });
  };

  public insertMultiSigTx = async (
    row: MultiSignRow,
    txBytes: string,
    txType: MultiSigTxType,
  ) => {
    await this.txRepository
      .createQueryBuilder()
      .delete()
      .where({ tx: row, type: txType })
      .execute();
    const txChunks = sliceToChunksString(txBytes, TX_CHUNK_SIZE);
    for (const [index, chunk] of txChunks.entries()) {
      await this.txRepository.insert({
        tx: row,
        bytes: chunk,
        idx: index,
        type: txType,
      });
    }
  };

  public insertMultiSigInputs = async (
    row: MultiSignRow,
    inputs: Array<string>,
  ) => {
    await this.inputRepository
      .createQueryBuilder()
      .delete()
      .where({ tx: row })
      .execute();
    for (const input of inputs) {
      await this.inputRepository.insert({
        tx: row,
        bytes: input,
      });
    }
  };

  public insertMultiSigCommitments = async (
    row: MultiSignRow,
    commitments: Array<Array<string>>,
    secrets: Array<Array<string>>,
  ) => {
    await this.commitmentRepository
      .createQueryBuilder()
      .delete()
      .where({ tx: row })
      .execute();
    for (const [inputIndex, inputCommitment] of commitments.entries()) {
      for (const [index, commitment] of inputCommitment.entries()) {
        if (commitment) {
          await this.commitmentRepository.insert({
            tx: row,
            bytes: commitment,
            index: index,
            inputIndex: inputIndex,
            secret:
              secrets.length > inputIndex &&
              secrets[inputIndex].length > index &&
              secrets[inputIndex][index].length > 0
                ? secrets[inputIndex][index]
                : '',
          });
        }
      }
    }
  };

  public insertMultiSigSigner = async (
    row: MultiSignRow,
    signers: Array<string>,
    simulated: Array<string>,
  ) => {
    await this.signerRepository
      .createQueryBuilder()
      .delete()
      .where({ tx: row })
      .execute();
    for (const signer of signers) {
      await this.signerRepository.insert({
        tx: row,
        signer: signer,
        type: MultiSigSignerType.Signed,
      });
    }
    for (const single of simulated) {
      await this.signerRepository.insert({
        tx: row,
        signer: single,
        type: MultiSigSignerType.Simulated,
      });
    }
  };

  public getRowById = async (id: number) => {
    return await this.rowRepository.findOneBy({ id });
  };

  public getWalletRows = (walletId: number, txIds?: Array<string>) => {
    let query = this.rowRepository
      .createQueryBuilder()
      .select()
      .where('walletId=:walletId', { walletId });
    if (txIds) {
      query = query.andWhere('txId IN (:...txIds)', { txIds });
    }
    return query.getMany();
  };

  public getTx = async (row: MultiSignRow, txType: MultiSigTxType) => {
    const elements = await this.txRepository
      .createQueryBuilder()
      .select()
      .where({ tx: row, type: txType })
      .getMany();
    const sortedElements = elements.sort((a, b) => a.idx - b.idx);
    return sortedElements.map((item) => item.bytes).join('');
  };

  public getInputs = async (row: MultiSignRow) => {
    const elements = await this.inputRepository
      .createQueryBuilder()
      .select()
      .where({ tx: row })
      .getMany();
    return elements.map((item) => item.bytes);
  };

  public getCommitments = async (
    row: MultiSignRow,
    inputCount: number,
    signerCount: number,
  ) => {
    const elements = await this.commitmentRepository
      .createQueryBuilder()
      .select()
      .where({ tx: row })
      .getMany();
    const commitments = Array(inputCount)
      .fill('')
      .map(() => Array(signerCount).fill(''));
    const secrets = Array(inputCount)
      .fill('')
      .map(() => Array(signerCount).fill(''));
    elements.forEach((dbElement) => {
      commitments[dbElement.inputIndex][dbElement.index] = dbElement.bytes;
      secrets[dbElement.inputIndex][dbElement.index] = dbElement.secret;
    });
    return {
      commitments,
      secrets,
    };
  };

  public getSigners = async (row: MultiSignRow) => {
    const signed: Array<string> = [];
    const simulated: Array<string> = [];
    const elements = await this.signerRepository
      .createQueryBuilder()
      .select()
      .where({ tx: row })
      .getMany();
    elements.forEach((element) => {
      if (element.type === MultiSigSignerType.Signed) {
        signed.push(element.signer);
      } else {
        simulated.push(element.signer);
      }
    });
    return { signed, simulated };
  };
}

const initializeAction = (dataSource: DataSource) => {
  WalletDbAction.initialize(dataSource);
  AddressDbAction.initialize(dataSource);
  AddressValueDbAction.initialize(dataSource);
  BoxDbAction.initialize(dataSource);
  AssetDbAction.initialize(dataSource);
  ConfigDbAction.initialize(dataSource);
  SavedAddressDbAction.initialize(dataSource);
  MultiSigDbAction.initialize(dataSource);
  MultiStoreDbAction.initialize(dataSource);
};

export {
  WalletDbAction,
  AddressDbAction,
  AddressValueDbAction,
  ConfigDbAction,
  BoxDbAction,
  AssetDbAction,
  SavedAddressDbAction,
  MultiSigDbAction,
  MultiStoreDbAction,
  initializeAction,
};
