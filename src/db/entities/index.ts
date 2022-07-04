import Wallet  from './Wallet';
import Address from './Address';
import Tx  from './Tx';
import Asset from './Asset';
import Box from "./Box";
import BoxContent from './BoxContent';
import WalletTx from './views/WalletTx';
import WalletWithErg, { AddressTokenId } from "./views/WalletWithErg";
import AddressWithErg from './views/AddressWithErg';
import Block from "./Block";
import TokenWithAddress from "./views/AddressToken";
import Config from "./Config";
import AssetCountBox from "./views/AssetCountBox";

const Entities = [
    Wallet,
    Address,
    Block,
    Tx,
    Asset,
    Box,
    BoxContent,
    AddressTokenId,
    AddressWithErg,
    WalletWithErg,
    TokenWithAddress,
    WalletTx,
    Config,
    AssetCountBox,
];


export default Entities;
