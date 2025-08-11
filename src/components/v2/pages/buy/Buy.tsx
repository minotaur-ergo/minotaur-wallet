import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import AppFrame from '../../layouts/AppFrame';
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import { ADDRESSES } from '../../data';

const Buy = () => {
  const [address, setAddress] = useState<string>('');

  const handleChangeAddress = (event: SelectChangeEvent) => {
    setAddress(event.target.value as string);
  };

  return (
    <AppFrame
      title="Buy Erg"
      navigation={<BackButton />}
      toolbar={<Button disabled={address === ''}>Next</Button>}
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
          {ADDRESSES.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {address.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AppFrame>
  );
};

export default Buy;
