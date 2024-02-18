import Wallet from './Wallet';
import Address from './Address';
import Asset from './Asset';
import Config from './Config';
import MultiSigKey from './MultiSigKey';
import MultiSignRow from './multi-sig/MultiSignRow';
import MultiSignTx from './multi-sig/MultiSignTx';
import MultiSignInput from './multi-sig/MultiSignInput';
import MultiCommitment from './multi-sig/MultiCommitment';
import MultiSigner from './multi-sig/MultiSigner';
import AddressValueInfo from './AddressValueInfo';
import SavedAddress from './SavedAddress';
import Box from './Box';

const Entities = [
  Wallet,
  MultiSigKey,
  Address,
  Box,
  Asset,
  Config,
  MultiSignRow,
  MultiSignTx,
  MultiSignInput,
  MultiCommitment,
  MultiSigner,
  AddressValueInfo,
  SavedAddress,
];

export default Entities;
