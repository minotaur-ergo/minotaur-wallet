import { getConnection } from "typeorm";
import Wallet, { WalletType } from "../entities/Wallet";
import Address from "../entities/Address";
import { getWalletById } from "./wallet";
import AddressWithErg from "../entities/views/AddressWithErg";

const getAddressRepository = () => getConnection().getRepository(Address);
const getAddressWithErgRepository = () => getConnection().getRepository(AddressWithErg);

const saveAddress = async (wallet: Wallet, name: string, address: string, path: string, index: number) => {
    const entity = {
        name: name,
        address: address,
        path: path,
        idx: index,
        network_type: wallet.network_type,
        wallet: wallet
    };
    return await (getAddressRepository().insert(entity));
};

const getAddress = async (addressId: number) => {
    // getAddressRepository().createQueryBuilder()
    return await (getAddressRepository().findOne({ id: addressId }));
};

const getAddressByAddressString = async (address: string) => {
    return await (getAddressWithErgRepository().findOne({ address: address }));
};

const getWalletAddresses = async (walletId: number) => {
    const wallet = await getWalletById(walletId);
    if (wallet) {
        return await getAddressWithErgRepository().find({ walletId: wallet.id });
    }
    return [];
};

const getWalletAddressesWithoutErg = async (walletId: number) => {
    const wallet = await getWalletById(walletId);
    if (wallet) {
        return await getAddressRepository().find({ wallet: wallet });
    }
    return [];
};

const getLastAddress = async (wallet_id: number) => {
    const queryBuilder = getAddressRepository().createQueryBuilder("lastIndex");
    queryBuilder.select("MAX(\"idx\")", "lastIndex").where(`walletId=${wallet_id}`);
    const res = await queryBuilder.getRawOne();
    return res === undefined ? -1 : res.lastIndex;
};

const updateAddressName = async (addressId: number, newName: string) => {
    return await getAddressRepository().createQueryBuilder().update().set(
        { name: newName }
    ).where("id=:id", { id: addressId }).execute();
};

const getAllAddresses = async () => {
    return await getAddressRepository().find();
};

const getSyncingAddresses = async (network_type: string) => {
    return await getAddressRepository()
        .createQueryBuilder()
        .innerJoin("wallet", "Wallet", "walletId = Wallet.id")
        .where("Wallet.type <> :type", { type: WalletType.Cold })
        .andWhere("Wallet.network_type = :network_type", {network_type: network_type})
        .getMany();
};

const setAddressHeight = async (addressId: number, height: number, height_type: "tx_load" | "tx_create_box" | "tx_spent_box") => {
    return await getAddressRepository().createQueryBuilder().update().set(
        {[height_type + "_height"]: height}
    ).where("id=:id", {id: addressId}).execute();
}
export {
    saveAddress,
    getAddress,
    getAllAddresses,
    getWalletAddresses,
    getWalletAddressesWithoutErg,
    getLastAddress,
    updateAddressName,
    getAddressByAddressString,
    getSyncingAddresses,
    setAddressHeight
};
