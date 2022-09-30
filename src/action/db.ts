import Address from "../db/entities/Address";
import { DataSource, EntityManager, Repository } from "typeorm";
import AddressWithErg from "../db/entities/views/AddressWithErg";
import Wallet, { WalletType } from "../db/entities/Wallet";
import WalletWithErg from "../db/entities/views/WalletWithErg";
import Asset from "../db/entities/Asset";
import { BoxAsset, ErgoBox, ErgoTx, TokenInfo } from "../util/network/models";
import Block from "../db/entities/Block";
import Box from "../db/entities/Box";
import Tx, { TxStatus } from "../db/entities/Tx";
import { JsonBI } from "../util/json";
import * as wasm from "ergo-lib-wasm-browser";
import { CoveringResult } from "../util/interface";
import WalletTx from "../db/entities/views/WalletTx";
import BoxContent from "../db/entities/BoxContent";
import TokenWithAddress from "../db/entities/views/AddressToken";
import Config from "../db/entities/Config";
import AssetCountBox from "../db/entities/views/AssetCountBox";
import { getConnection, QueryRunner } from "typeorm/browser";

class WalletActionClass {
    private walletRepository: Repository<Wallet>;
    private walletWithErgRepository: Repository<WalletWithErg>;

    constructor(dataSource: DataSource) {
        this.walletRepository = dataSource.getRepository(Wallet);
        this.walletWithErgRepository = dataSource.getRepository(WalletWithErg);
    }

    createWallet = async (name: string, type: WalletType, seed: string, extended_public_key: string, network_type: string) => {
        const wallet = {
            name: name,
            type: type,
            seed: seed,
            extended_public_key: extended_public_key,
            network_type: network_type
        };
        return await this.walletRepository.save(wallet);
    };

    getWalletsWithErg = async () => {
        return await this.walletWithErgRepository.find();
    };

    getWalletWithErg = async (walletId: number) => {
        return await this.walletWithErgRepository.findOneBy({ id: walletId });
    };

    getWalletById = async (walletId: number) => {
        return this.walletRepository.findOneBy({ id: walletId });
    };

    getWallets = async () => {
        return this.walletRepository.find();
    };
}

class AddressActionClass {
    private addressRepository: Repository<Address>;
    private addressWithErgRepository: Repository<AddressWithErg>;

    constructor(dataSource: DataSource) {
        this.addressRepository = dataSource.getRepository(Address);
        this.addressWithErgRepository = dataSource.getRepository(AddressWithErg);
    }

    saveAddress = async (wallet: Wallet, name: string, address: string, path: string, index: number) => {
        const entity = {
            name: name,
            address: address,
            path: path,
            idx: index,
            network_type: wallet.network_type,
            wallet: wallet
        };
        return await this.addressRepository.save(entity);
    };

    getAddress = async (addressId: number) => {
        return await this.addressRepository.findOneBy({ id: addressId });
    };

    getAddressByAddressString = async (address: string) => {
        return await (this.addressWithErgRepository.findOneBy({ address: address }));
    };

    getWalletAddressesWithErg = async (walletId: number) => {
        const wallet = await WalletDbAction.getWalletById(walletId);
        if (wallet) {
            return await this.addressWithErgRepository.createQueryBuilder()
                .where("walletId = :walletId", { walletId: wallet.id })
                .orderBy("idx")
                .addOrderBy("address")
                .getMany();
        }
        return [];
    };

    getWalletAddresses = async (walletId: number) => {
        const wallet = await WalletDbAction.getWalletById(walletId);
        if (wallet) {
            return await this.addressRepository.createQueryBuilder()
                .where("walletId = :walletId", { walletId: wallet.id })
                .orderBy("idx")
                .addOrderBy("address")
                .getMany();
        }
        return [];
    };

    getLastAddress = async (wallet_id: number) => {
        const queryBuilder = this.addressRepository.createQueryBuilder("lastIndex");
        queryBuilder.select("MAX(\"idx\")", "lastIndex").where(`walletId=${wallet_id}`);
        const res = await queryBuilder.getRawOne();
        return res === undefined ? -1 : res.lastIndex;
    };

    updateAddressName = async (addressId: number, newName: string) => {
        return await this.addressRepository.createQueryBuilder().update().set(
            { name: newName }
        ).where("id=:id", { id: addressId }).execute();
    };

    getAllAddresses = async () => {
        return await this.addressRepository.find();
    };

    getAllAddressOfNetworkType = async (networkType: string) => {
        const addresses = await this.addressRepository.find({
            relations: ["wallet"]
        });
        return addresses.filter(item => item.wallet?.network_type == networkType).sort((a, b) => a.wallet?.id! - b.wallet?.id!);
    };


    setAddressHeight = async (addressId: number, height: number) => {
        return await this.addressRepository.createQueryBuilder().update().set(
            { "process_height": height }
        ).where("id=:id", { id: addressId }).execute();
    };

    setAllAddressHeight = async (height: number, network_type: string) => {
        await this.addressRepository.createQueryBuilder().update().set(
            { "process_height": height }
        ).where(`process_height > :height AND network_type = :network_type`, {
            height: height,
            network_type: network_type
        }).execute();
    };
}

class AssetActionClass {
    private assetRepository: Repository<Asset>;

    constructor(dataSource: DataSource) {
        this.assetRepository = dataSource.getRepository(Asset);
    }

    getAssetByAssetId = async (assetId: string, network_type: string) => {
        return await this.assetRepository.findOneBy({ asset_id: assetId, network_type: network_type });
    };

    createOrUpdateAsset = async (info: TokenInfo, network_type: string) => {
        const dbEntity = await this.getAssetByAssetId(info.id, network_type);
        const entity = {
            asset_id: info.id,
            box_id: info.boxId,
            name: info.name,
            network_type: network_type,
            description: info.description,
            decimal: info.decimals
        };
        if (dbEntity) {
            await this.assetRepository.createQueryBuilder().update().set(entity).where("id=:id", { id: dbEntity.id }).execute();
        } else {
            await this.assetRepository.insert(entity);
        }
        return await this.getAssetByAssetId(info.id, network_type);
    };

    getAllAsset = async (network_type: string) => {
        return await this.assetRepository.findBy({ network_type: network_type });
    };
}

class BlockActionClass {
    private repository: Repository<Block>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Block);
    }

    getLastHeaders = async (count: number) => {
        return await this.repository.createQueryBuilder()
            .limit(count)
            .offset(0)
            .orderBy("height", "DESC")
            .getMany();
    };  
    
    /**
     * get all block headers with given network type(if persent) in db
     * @param network_type 
     * @returns block headers
     */
    getAllHeaders = async (network_type ?: string) => {
        // return await this.repository.find()
        if(typeof network_type !== 'undefined'){
                return await this.repository.createQueryBuilder()
                    .orderBy("height", "DESC")
                    .where("network_type = :network_type", { network_type: network_type })
                    .getMany();
        }
        return await this.repository.createQueryBuilder()
        .orderBy("height", "DESC")
        .getMany();

    };

    InsertHeader = async (id: string, height: number, network_type: string) => {
        const entity = {
            block_id: id,
            height: height,
            network_type: network_type
        };
        await this.repository.insert(entity);
    };

    forkHeaders = async (height: number, network_type: string) => {
        return await this.repository
            .createQueryBuilder()
            .where("height >= :height", { height: height })
            .andWhere("network_type = :network_type", { network_type: network_type })
            .delete()
            .execute();
    };

    removeOldHeaders = async (height: number, network_type: string) => {
        return await this.repository
            .createQueryBuilder()
            .where("height < :height", { height: height })
            .andWhere("network_type = :network_type", { network_type: network_type })
            .delete()
            .execute();
    };

    InsertHeaders = async (headers: Array<{ id: string, height: number }>, network_type: string) => {
        const entities = headers.map(item => ({ block_id: item.id, height: item.height, network_type: network_type }));
        await this.repository.insert(entities);
    };
}

class BoxActionClass {
    private repository: Repository<Box>;
    private assetCountBoxRepository: Repository<AssetCountBox>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Box);
        this.assetCountBoxRepository = dataSource.getRepository(AssetCountBox);
    }

    createOrUpdateBox = async (box: ErgoBox, address: Address, tx: Tx, index: number) => {
        const dbEntity = await this.getBoxByBoxId(box.boxId, address.network_type);
        const erg_total = BigInt(box.value);
        const entity = {
            address: address,
            tx: tx,
            box_id: box.boxId,
            erg: erg_total,
            create_index: index,
            network_type: address.network_type,
            json: JsonBI.stringify(box),
            create_height: tx.height
        };
        if (dbEntity) {
            await this.repository.createQueryBuilder().update().set(entity).where("id=:id", { id: dbEntity.id }).execute();
        } else {
            await this.repository.insert(entity);
        }
        return await this.getBoxByBoxId(box.boxId, address.network_type);
    };

    spentBox = async (boxId: string, spendTx: Tx, index: number) => {
        const dbEntity = await this.getBoxByBoxId(boxId, spendTx.network_type);
        if (dbEntity) {
            dbEntity.spend_tx = spendTx;
            dbEntity.spend_index = index;
            dbEntity.spend_height = spendTx.height;
            return await this.repository.createQueryBuilder().update().set(
                { spend_tx: spendTx, spend_index: index, spend_height: spendTx.height }
            ).where("id=:id", { id: dbEntity.id }).execute();
        }
        return null;
    };

    getBoxByBoxId = async (boxId: string, network_type: string) => {
        return await this.repository.findOneBy({ box_id: boxId, network_type: network_type });
    };

    getBoxById = async (id: number) => {
        return await this.repository.findOneBy({ id: id });
    };

    getWalletBoxes = async (walletId: number) => {
        return await this.repository.createQueryBuilder()
            .innerJoin("address", "Address", "Address.id = addressId")
            .where("walletId = :walletId AND spendTxId IS NULL", { walletId: walletId })
            .getMany();
    };

    getAddressBoxes = async (address: Array<Address>) => {
        return this.repository.createQueryBuilder()
            .where(address.map(item => `addressId=${item.id}`).join(" OR "))
            .andWhere("spendTxId IS NULL").getMany();
    };

    getCoveringBoxFor = async (amount: bigint, walletId: number, tokens: { [id: string]: bigint }, address?: Array<Address> | null): Promise<CoveringResult> => {
        const requiredTokens: { [id: string]: bigint } = { ...tokens };
        let requiredAmount: bigint = amount;
        let selectedBoxesJson: Array<string> = [];
        const checkIsRequired = (box: wasm.ErgoBox) => {
            if (requiredAmount > 0) return true;
            for (let index = 0; index < box.tokens().len(); index++) {
                const token = box.tokens().get(index);
                const requiredAmount = requiredTokens[token.id().to_str()];
                if (requiredAmount && requiredAmount > BigInt(0)) {
                    return true;
                }
            }
            return false;
        };
        const addBox = (box: wasm.ErgoBox) => {
            selectedBoxesJson.push(box.to_json());
            requiredAmount -= BigInt(box.value().as_i64().to_str());
            for (let index = 0; index < box.tokens().len(); index++) {
                const token = box.tokens().get(index);
                if (requiredTokens.hasOwnProperty(token.id().to_str())) {
                    requiredTokens[token.id().to_str()] -= BigInt(token.amount().as_i64().to_str());
                }
            }
        };
        const remaining = () => requiredAmount > BigInt(0) || (Object.keys(requiredTokens).filter(token => requiredTokens[token] > 0).length > 0);
        const boxes = await (address ? this.getAddressBoxes(address as Array<Address>) : this.getWalletBoxes(walletId));
        for (let boxObject of boxes) {
            const box = wasm.ErgoBox.from_json(boxObject.json);
            if (checkIsRequired(box)) {
                addBox(box);
            }
            if (!remaining()) {
                return {
                    covered: true,
                    boxes: wasm.ErgoBoxes.from_boxes_json(selectedBoxesJson)
                };
            }
        }
        return {
            covered: false,
            boxes: wasm.ErgoBoxes.from_boxes_json(selectedBoxesJson)
        };
    };

    getUsedAddressIds = async (walletId: string) => {
        return await this.repository.createQueryBuilder()
            .select("addressId")
            .innerJoin("address", "Address", "addressId = Address.id")
            .where("walletId = :walletId", { walletId: walletId })
            .distinct()
            .getRawMany<{ addressId: number }>();
    };

    forkBoxes = async (height: number, network_type: string) => {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ spend_tx: null, spend_index: undefined, spend_height: undefined })
            .where("create_height >= :height", { height: height })
            .execute();
        // await forkBoxContents(address.id, height);
        await this.repository
            .createQueryBuilder()
            .where("create_height >= :height", { height: height })
            .andWhere("network_type = :network_type", { network_type: network_type })
            .delete()
            .execute();
    };

    invalidAssetCountBox = async () => {
        return await this.assetCountBoxRepository.createQueryBuilder()
            .where("inserted <> total")
            .getMany();
    };
}

class TxActionClass {
    private repository: Repository<Tx>;
    private walletRepository: Repository<WalletTx>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Tx);
        this.walletRepository = dataSource.getRepository(WalletTx);
    }


    updateOrCreateTx = async (tx: ErgoTx, status: TxStatus, network_type: string) => {
        const dbTx = await this.getTxByTxId(tx.id, network_type);
        const entity = {
            tx_id: tx.id,
            height: tx.inclusionHeight,
            date: tx.timestamp,
            status: status,
            network_type: network_type
        };
        if (dbTx) {
            await this.repository.createQueryBuilder().update().set(entity).where("id=:id", { id: dbTx.id }).execute();
            return { status: dbTx.status, tx: await this.getTxByTxId(tx.id, network_type) };
        } else {
            return { status: TxStatus.New, tx: await this.repository.save(entity) as Tx };
        }
    };

    getTxByTxId = async (txId: string, network_type: string) => {
        return await this.repository.findOneBy({ tx_id: txId, network_type: network_type });
    };

    getTxById = async (id: number) => {
        return await this.repository.findOneBy({ id: id });
    };

    getWalletTx = async (wallet_id: number, limit: number, offset: number) => {
        return await this.walletRepository.createQueryBuilder()
            .where("create_wallet_id=:wallet_id", { wallet_id: wallet_id })
            .limit(limit)
            .offset(offset)
            .getMany();
    };

    getNetworkTxs = async (network_type: string, from_height: number, to_height: number) => {
        return this.repository
            .createQueryBuilder()
            .where("network_type=:network_type", { network_type: network_type })
            .andWhere("height >= :from_height", { from_height: from_height })
            .andWhere("height <= :to_height", { to_height: to_height })
            .getMany();
    };
    
    forkTxs = async (height: number, network_type: string) => {
        await this.repository
            .createQueryBuilder()
            .where("height >= :height", { height: height })
            .andWhere("network_type = :network_type", { network_type: network_type })
            .delete()
            .execute();
    };

    insertTxs = async(txs: ErgoTx[], network_type: string) => {
        const entities = txs.map(tx => ({...txs, network_type: network_type}));
        await this.repository.insert(entities);
    };
}

class BoxContentActionClass {
    private repository: Repository<BoxContent>;
    private tokenWithAddressRepository: Repository<TokenWithAddress>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(BoxContent);
        this.tokenWithAddressRepository = dataSource.getRepository(TokenWithAddress);
    }

    createOrUpdateBoxContent = async (box: Box, asset: BoxAsset) => {
        const dbEntity = await this.repository.createQueryBuilder()
            .where("boxId=:boxId AND token_id=:token_id", { boxId: box.id, token_id: asset.tokenId })
            .getOne();
        const entity = {
            token_id: asset.tokenId,
            box: box,
            amount: BigInt(asset.amount)
        };
        if (dbEntity) {
            await this.repository.createQueryBuilder().update().set(
                entity
            ).where("id=:id", { id: dbEntity.id }).execute();
        } else {
            await this.repository.insert(entity);
        }
    };

    getTokens = async (network_type: string) => {
        return (await this.repository
            .createQueryBuilder()
            .select("token_id", "tokenId")
            .innerJoin("box", "Box", "Box.id=boxId")
            .where("network_type = :network_type", { network_type: network_type })
            .addGroupBy("token_id")
            .getRawMany()).map((item: { tokenId: string }) => item.tokenId);
    };

    getAddressTokens = async (addressId: number) => {
        return (await this.repository
            .createQueryBuilder()
            .select("token_id", "tokenId")
            .addSelect("SUM(amount)", "total")
            .innerJoin("box", "Box", "Box.id=boxId")
            .where("Box.addressId = :addressId", { addressId: addressId })
            .addGroupBy("token_id")
            .getRawMany()).map((item: { tokenId: string, total: string }) => item.tokenId);
    };

    getWalletTokens = async (walletId: number) => {
        return (await this.repository
            .createQueryBuilder()
            .select("token_id", "tokenId")
            .addSelect("CAST(SUM(CAST(amount AS INT)) AS TEXT)", "total")
            .innerJoin("box", "Box", "Box.id=boxId")
            .innerJoin("address", "Address", "Box.addressId=Address.id")
            .where("Address.walletId = :walletId and Box.spendTxId IS NULL", { walletId: walletId })
            .addGroupBy("token_id")
            .getRawMany<{ tokenId: string, total: string }>());
    };

    forkBoxContents = async (height: number, network_type: string) => {
        const instances = await this.repository
            .createQueryBuilder()
            .innerJoin("box", "Box", "Box.id = boxId")
            .where("create_height >= :height", { height: height })
            .andWhere("network_type=:network_type", { network_type: network_type })
            .getMany();
        await this.repository.remove(instances);
    };

    getTokenWithAddressForWallet = async (walletId: number) => {
        return await this.tokenWithAddressRepository.findBy({ wallet_id: walletId });
    };

    getSingleTokenWithAddressForWallet = async (walletId: number, tokenId: string) => {
        return await this.tokenWithAddressRepository.findBy({ wallet_id: walletId, token_id: tokenId });
    };
}

class ConfigActionClass {
    private repository: Repository<Config>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Config);
    }

    getAllConfig = async () => {
        return await this.repository.find();
    };

    setConfig = async (key: string, value: string) => {
        const entity = await this.repository.findOneBy({ key: key });
        if (entity) {
            return await this.repository.createQueryBuilder().update().set(
                { value: value }
            ).where("key=:key", { key: key }).execute();
        } else {
            return await this.repository.insert({
                key: key,
                value: value
            });
        }
    };
}

class DbTransactionClass {
    private queryRunner;
    
    constructor(dataSource: DataSource) {
        this.queryRunner = dataSource.createQueryRunner(); 
    }

    fork = async(forkHeight: number, network_type: string) => {
        this.queryRunner.connect();
        this.queryRunner.startTransaction();
        try{
            await BoxDbAction.forkBoxes(forkHeight, network_type);
            await TxDbAction.forkTxs(forkHeight, network_type);
            await this.queryRunner.commitTransaction();
        }
        catch{
            this.queryRunner.rollbackTransaction();
        }
        finally{
            this.queryRunner.release();
        }
    }
}

let BoxContentDbAction: BoxContentActionClass;
let AddressDbAction: AddressActionClass;
let WalletDbAction: WalletActionClass;
let ConfigDbAction: ConfigActionClass;
let AssetDbAction: AssetActionClass;
let BlockDbAction: BlockActionClass;
let BoxDbAction: BoxActionClass;
let TxDbAction: TxActionClass;

let DbTransaction: DbTransactionClass;

const initializeAction = (dataSource: DataSource) => {
    BoxContentDbAction = new BoxContentActionClass(dataSource);
    AddressDbAction = new AddressActionClass(dataSource);
    WalletDbAction = new WalletActionClass(dataSource);
    ConfigDbAction = new ConfigActionClass(dataSource);
    AssetDbAction = new AssetActionClass(dataSource);
    BlockDbAction = new BlockActionClass(dataSource);
    BoxDbAction = new BoxActionClass(dataSource);
    TxDbAction = new TxActionClass(dataSource);

    DbTransaction = new DbTransactionClass(dataSource);
};

export {
    BoxContentDbAction,
    AddressDbAction,
    WalletDbAction,
    ConfigDbAction,
    AssetDbAction,
    BlockDbAction,
    BoxDbAction,
    TxDbAction,
    DbTransaction,
    initializeAction
};