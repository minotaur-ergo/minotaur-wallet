import MultiSigHint from '@/db/entities/multi-sig/MultiSigHint';
import Wallet from './Wallet';
import Address from './Address';
import Asset from './Asset';
import Config from './Config';
import MultiSigKey from './MultiSigKey';
import MultiSigRow from './multi-sig/MultiSigRow';
import MultiSigTx from './multi-sig/MultiSigTx';
import MultiSigInput from './multi-sig/MultiSigInput';
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
  MultiSigRow,
  MultiSigTx,
  MultiSigInput,
  MultiSigHint,
  AddressValueInfo,
  SavedAddress,
  Pin,
];

export default Entities;
