import Wallet from './Wallet';
import Address from './Address';
import Tx from './Tx';
import Asset from './Asset';
import Box from './Box';
import BoxContent from './BoxContent';
import WalletTx from './views/WalletTx';
import WalletWithErg, { AddressTokenId } from './views/WalletWithErg';
import AddressWithErg from './views/AddressWithErg';
import Block from './Block';
import TokenWithAddress from './views/AddressToken';
import Config from './Config';
import AssetCountBox from './views/AssetCountBox';
import TxBoxCount from './views/TxBoxCount';
import MultiSigKey from './MultiSigKey';
import MultiSignRow from './multi-sig/MultiSignRow';
import MultiSignTx from './multi-sig/MultiSignTx';
import MultiSignInput from './multi-sig/MultiSignInput';
import MultiCommitment from './multi-sig/MultiCommitment';
import MultiSigner from './multi-sig/MultiSigner';

const Entities = [
  Wallet,
  MultiSigKey,
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
  TxBoxCount,
  MultiSignRow,
  MultiSignTx,
  MultiSignInput,
  MultiCommitment,
  MultiSigner,
];

export default Entities;
