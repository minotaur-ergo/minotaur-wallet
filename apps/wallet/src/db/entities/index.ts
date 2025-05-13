import MultiSigHint from '@/db/entities/multi-sig/MultiSigHint';
import Wallet from './Wallet';
import Address from './Address';
import Asset from './Asset';
import Config from './Config';
import MultiSigKey from './MultiSigKey';
import MultiSignRow from './multi-sig/MultiSigRow';
import MultiSignTx from './multi-sig/MultiSigTx';
import MultiSignInput from './multi-sig/MultiSigInput';
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
  MultiSigHint,
  AddressValueInfo,
  SavedAddress,
  Pin,
];

export default Entities;
