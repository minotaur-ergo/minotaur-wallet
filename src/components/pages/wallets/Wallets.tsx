import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
// import { RouterMap } from '../../V2Demo';
import TotalBalanceCard from './components/TotalBalanceCard';
import Heading from '../../components/Heading';
import WalletItem from './components/WalletItem';

const Wallets = () => {
  const navigate = useNavigate();
  const wallets = [
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '2',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
    {
      id: '1',
      name: 'My First Wallet',
      type: 'Normal Wallet',
      net: 'MAIN-NET',
      amount: 34.2,
      value: 71.04,
    },
  ];

  return (
    <AppFrame
      title="My Wallets"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={() => navigate(RouterMap.AddWallet)}>
          <AddIcon />
        </IconButton>
      }
    >
      <TotalBalanceCard />
      <Heading title="Wallets List" />
      <Stack spacing={2}>
        {wallets.map((item, index) => (
          <WalletItem {...item} index={index} key={index} />
        ))}
      </Stack>
    </AppFrame>
  );
};

export default Wallets;
