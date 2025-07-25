import MultiSigHint from '@/db/entities/multi-sig/MultiSigHint';

import Address from './Address';
import AddressValueInfo from './AddressValueInfo';
import Asset from './Asset';
import Box from './Box';
import Config from './Config';
import MultiSigInput from './multi-sig/MultiSigInput';
import MultiSigRow from './multi-sig/MultiSigRow';
import MultiSigTx from './multi-sig/MultiSigTx';
import MultiSigKey from './MultiSigKey';
import Pin from './Pin';
import SavedAddress from './SavedAddress';
import Wallet from './Wallet';

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
