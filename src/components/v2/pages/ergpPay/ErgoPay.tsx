import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
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
import CloseIcon from '@mui/icons-material/Close';
import StateMessage from '../../components/StateMessage';
import SvgIcon from '../../icons/SvgIcon';

const ErgoPay = () => {
  const [walletId, setWalletId] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [waiting, setWaiting] = useState(false);
  const [dialog, setDialog] = useState({
    open: true,
    color: 'warning',
    icon: 'warning',
    title: 'Warning',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });
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
          setDialog({
            open: true,
            icon: 'info',
            color: 'info',
            title: 'Info title',
            message:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          });
          break;
        case 1:
          setDialog({
            open: true,
            icon: 'error',
            color: 'error',
            title: 'Error title',
            message:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          });
          break;
        case 2:
          setDialog({
            open: true,
            icon: 'warning',
            color: 'warning',
            title: 'Warning title',
            message:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          });
          break;
        case 3:
          setDialog({
            open: true,
            icon: 'approved',
            color: 'success',
            title: 'Success title',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          });
          break;
        default:
          navigate(RouterMap.Home);
      }
      setWaiting(false);
    }, 1000);
  };
  const handleCloseDialog = () => {
    setDialog((prevState) => ({ ...prevState, open: false }));
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
        <InputLabel id="select-address-label">Address</InputLabel>
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

      <Dialog
        open={dialog.open}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { p: 3 },
        }}
      >
        <Box display="flex" m={-2} justifyContent="end">
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <StateMessage
          title={dialog.title}
          description={dialog.message}
          color={`${dialog.color}.dark`}
          icon={<SvgIcon icon={dialog.icon} color={dialog.color} />}
        />
      </Dialog>
    </AppFrame>
  );
};

export default ErgoPay;
