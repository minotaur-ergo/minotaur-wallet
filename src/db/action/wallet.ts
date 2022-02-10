import { getConnection } from 'typeorm';
import Wallet, { WalletType } from '../entities/Wallet';
import WalletWithErg from '../entities/views/WalletWithErg';


const getWalletRepository = () => getConnection().getRepository(Wallet);
const getWalletWithErgRepository = () => getConnection().getRepository(WalletWithErg);

const createWallet = async (name: string, type: WalletType, seed: string, extended_public_key: string, network_type: string) => {
    const wallet = {
        name: name,
        type: type,
        seed: seed,
        extended_public_key: extended_public_key,
        network_type: network_type
    };
    return await getWalletRepository().save(wallet);
};

const getWallets = async () => {
    return await getWalletWithErgRepository().find();
};

const getWalletById = async (walletId: number) => {
    return getWalletRepository().findOne({ id: walletId });
};

export {
    createWallet,
    getWallets,
    getWalletById,
};
