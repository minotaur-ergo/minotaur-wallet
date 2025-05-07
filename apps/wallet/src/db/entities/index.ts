import Wallet from './Wallet';
import Address from './Address';
import Asset from './Asset';
import Config from './Config';
import MultiSigKey from './MultiSigKey';
import MultiSignRow from './multi-sig/MultiSignRow';
import MultiSignTx from './multi-sig/MultiSignTx';
import MultiSignInput from './multi-sig/MultiSignInput';
import MultiSigner from './multi-sig/MultiSigner';
import MultiSigHint from './multi-sig/MultiSigHint';
import AddressValueInfo from './AddressValueInfo';
import SavedAddress from './SavedAddress';
import Box from './Box';
import Pin from './Pin';

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
  MultiSigner,
  MultiSigHint,
  AddressValueInfo,
  SavedAddress,
  Pin,
];

export default Entities;
