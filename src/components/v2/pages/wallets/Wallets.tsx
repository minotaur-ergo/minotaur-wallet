import React, { useEffect, useRef } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';
import TotalBalanceCard from './components/TotalBalanceCard';
import Heading from '../../components/Heading';
import WalletItem from './components/WalletItem';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';
import HomeMoreMenu from '../../layouts/HomeMoreMenu';

const Wallets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useRef<SnackAlertHandle>(null);

  const wallets = [
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
      numberOfTokens: 5,
    },
    {
      id: '2',
      name: 'Secondary Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
      numberOfTokens: 2,
    },
    {
      id: '3',
      name: 'Wallet 3',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 42020.2,
      value: 87100.0,
    },
    {
      id: '4',
      name: 'My Wallet with Very Long Name',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '5',
      name: 'Last Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
      numberOfTokens: 1,
    },
    {
      id: '6',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
  ];

  useEffect(() => {
    if (location.state) {
      alert.current?.setMessage(location.state.message);
      alert.current?.open();
    }
  }, []);

  return (
    <AppFrame
      title="My Wallets"
      navigation={<BackButton />}
      actions={
        <>
          <IconButton onClick={() => navigate(RouterMap.AddWallet)}>
            <AddIcon />
          </IconButton>
          <HomeMoreMenu />
        </>
      }
    >
      <TotalBalanceCard />
      <Heading title="Wallets List" />
      <Stack spacing={2}>
        {wallets.map((item, index) => (
          <WalletItem {...item} index={index} key={index} />
        ))}
      </Stack>
      <SnackAlert ref={alert} />
    </AppFrame>
  );
};

export default Wallets;
