import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, WalletType } from '@minotaur-ergo/types';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface WalletSelectPropsType {
  label: string;
  walletId: string;
  networkType: string;
  select: (walletId: string) => unknown;
}

const WalletSelect = (props: WalletSelectPropsType) => {
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const handleChange = (event: SelectChangeEvent) => {
    props.select(event.target.value as string);
  };
  const filteredWallets = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          wallet.networkType === props.networkType &&
          [WalletType.ReadOnly, WalletType.Normal].indexOf(wallet.type) !==
            -1 &&
          wallet.xPub !== '',
      ),
    [props.networkType, wallets],
  );
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.walletId}
        onChange={handleChange}
      >
        {filteredWallets.map((wallet) => (
          <MenuItem value={`${wallet.id}`} key={`wallet-${wallet.id}`}>
            {wallet.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WalletSelect;
