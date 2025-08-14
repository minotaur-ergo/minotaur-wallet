import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StateWallet } from '@minotaur-ergo/types';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import AppFrame from '@/layouts/AppFrame';
import openInBrowser from '@/utils/browser';

interface BuyErgPropsType {
  wallet: StateWallet;
}

const BuyErg = (props: BuyErgPropsType) => {
  const [address, setAddress] = useState<string>('');
  const navigate = useNavigate();

  const handleChangeAddress = (event: SelectChangeEvent) => {
    setAddress(event.target.value as string);
  };

  const buyErg = () => {
    openInBrowser(
      `https://checkout.banxa.com/?coinType=ERG&walletAddress=${address}`,
    );
    navigate(-1);
  };

  return (
    <AppFrame
      title="Buy Erg"
      navigation={<BackButtonRouter />}
      toolbar={
        <Button disabled={address === ''} onClick={buyErg}>
          Buy
        </Button>
      }
    >
      <Typography color="text.secondary">
        Please select your address:
      </Typography>
      <FormControl sx={{ mt: 2 }}>
        <InputLabel id="select-address-label">Address</InputLabel>
        <Select
          labelId="select-address-label"
          id="select-address"
          value={address}
          onChange={handleChangeAddress}
        >
          <MenuItem value="" disabled>
            <em>Select an address</em>
          </MenuItem>
          {props.wallet.addresses.map((address) => (
            <MenuItem key={address.address} value={address.address}>
              {address.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AppFrame>
  );
};

export default BuyErg;
