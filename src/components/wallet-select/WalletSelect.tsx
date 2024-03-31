import { GlobalStateType } from '@/store';
import { StateAddress, StateWallet } from '@/store/reducer/wallet';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

interface WalletSelectPropsType {
  allowed: Array<number>;
  walletId: number;
  addressId: number;
  selectWallet: (wallet?: StateWallet) => unknown;
  selectAddress: (address?: StateAddress) => unknown;
  addressTitle: string;
  walletTitle: string;
  needAddress: boolean;
  allowMultipleAddress: boolean;
}

const WalletSelect = (props: WalletSelectPropsType) => {
  let wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  if (props.allowed.length > 0) {
    wallets = wallets.filter((item) => props.allowed.includes(item.id));
  }

  const handleSelectWallet = (walletId: string) => {
    const selected = wallets.filter(item => `${item.id}` === walletId);
    if(selected.length === 0){
        props.selectWallet(undefined);
        props.selectAddress(undefined);
    }else{
        props.selectWallet(selected[0]);
        // TODO must select address
    }
  };
  const selectedWalletList = wallets.filter(
    (item) => item.id === props.walletId,
  );
  const selectedWallet =
    selectedWalletList.length === 0 ? undefined : selectedWalletList[0];
  return (
    <React.Fragment>
      <Typography style={{ marginTop: 40 }}>{props.addressTitle}:</Typography>
      <FormControl sx={{ mt: 1 }}>
        <InputLabel id="select-wallet-label">Wallet</InputLabel>
        <Select
          labelId="select-wallet-label"
          id="select-wallet"
          value={`${props.walletId ? props.walletId : 'not selected'}`}
          onChange={(event) => handleSelectWallet(event.target.value)}
        >
          <MenuItem value="not selected">Select Wallet</MenuItem>
          {wallets.map((item) => (
            <MenuItem value={`${item.id}`} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.needAddress && selectedWallet ? (
        <React.Fragment>
          <Typography style={{ marginTop: 40 }}>
            {props.addressTitle}:
          </Typography>
          <FormControl sx={{ mt: 1 }}>
            <InputLabel id="select-address-label">Address</InputLabel>
            <Select
              labelId="select-wallet-label"
              id="select-wallet"
              value={props.addressId}
            //   onChange={(event) => setAddress(event.target.value)}
            >
              <MenuItem value="not selected">Select Address</MenuItem>
              {props.allowMultipleAddress ? (
                <MenuItem value="all">All Addresses</MenuItem>
              ) : undefined}
              {selectedWallet.addresses.map((item) => (
                <MenuItem value={`${item.id}`} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  );
};

export default WalletSelect;
