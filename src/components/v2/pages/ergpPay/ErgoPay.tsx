import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import AppFrame from '../../layouts/AppFrame';
import { useEffect, useRef, useState } from 'react';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';
import BackButton from '../../components/BackButton';
import { RouterMap } from '../../V2Demo';
import { useNavigate } from 'react-router-dom';

const ErgoPay = () => {
  const [walletId, setWalletId] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [waiting, setWaiting] = useState(false);
  const alert = useRef<SnackAlertHandle>(null);
  const navigate = useNavigate();

  const handleChangeWallet = (event: SelectChangeEvent) => {
    setWalletId(event.target.value as string);
  };
  const handleChangeAddress = (event: SelectChangeEvent) => {
    setAddress(event.target.value as string);
  };
  const handleNext = () => {
    setWaiting(true);
    setTimeout(() => {
      const status = Math.floor(Math.random() * 5);
      switch (status) {
        case 0:
          alert.current?.set(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'success'
          );
          alert.current?.open();
          break;
        case 1:
          alert.current?.set(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'warning'
          );
          alert.current?.open();
          break;
        case 2:
          alert.current?.set(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'error'
          );
          alert.current?.open();
          break;
        case 3:
          alert.current?.set(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'info'
          );
          alert.current?.open();
          break;
        default:
          navigate(RouterMap.Home);
      }
      setWaiting(false);
    }, 1000);
  };

  useEffect(() => {
    setAddress(undefined);
  }, [walletId]);

  return (
    <AppFrame
      title="Ergo pay"
      navigation={<BackButton />}
      toolbar={
        <Button onClick={handleNext} disabled={address === undefined}>
          Next
        </Button>
      }
    >
      <Typography>Please select your wallet:</Typography>
      <FormControl sx={{ mt: 1 }}>
        <InputLabel id="select-wallet-label">Wallet</InputLabel>
        <Select
          labelId="select-wallet-label"
          id="select-wallet"
          value={walletId}
          onChange={handleChangeWallet}
        >
          <MenuItem value={'01'}>My First Wallet</MenuItem>
          <MenuItem value={'02'}>Secondary Wallet</MenuItem>
          <MenuItem value={'03'}>Wallet 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ mt: 2 }}>
        <InputLabel id="select-address-label">From Address</InputLabel>
        <Select
          labelId="select-address-label"
          id="select-address"
          disabled={walletId === undefined}
          value={address}
          onChange={handleChangeAddress}
        >
          <MenuItem value={10}>All Addresses</MenuItem>
          <MenuItem value={20}>Main Address</MenuItem>
          <MenuItem value={30}>Secondary Address</MenuItem>
        </Select>
        <FormHelperText sx={{ fontSize: '1rem' }}>
          {(38).toFixed(2)} available
        </FormHelperText>
      </FormControl>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackAlert ref={alert} />
    </AppFrame>
  );
};

export default ErgoPay;
