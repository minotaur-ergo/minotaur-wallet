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
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.walletId}
        onChange={handleChange}
      >
        {wallets.map((wallet) =>
          wallet.networkType === props.networkType &&
          [WalletType.ReadOnly, WalletType.Normal].indexOf(wallet.type) !==
            -1 ? (
            <MenuItem value={`${wallet.id}`} key={`wallet-${wallet.id}`}>
              {wallet.name}
            </MenuItem>
          ) : null,
        )}
      </Select>
    </FormControl>
  );
};

export default WalletSelect;
