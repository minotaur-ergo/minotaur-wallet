import { IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
// import TotalBalanceCard from './components/TotalBalanceCard';
import Heading from '@/components/heading/Heading';
import WalletItem from './components/WalletItem';
import AppFrame from '@/layouts/AppFrame';
import { GlobalStateType } from '@/store';
import { useSelector } from 'react-redux';
import { getRoute, RouteMap } from '@/router/routerMap';
import { StateWallet } from '@/store/reducer/wallet';
import TotalBalanceCard from './components/TotalBalanceCard';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import React from 'react';
import HomeAction from '@/components/home-action/HomeAction';

const Wallets = () => {
  const navigate = useNavigate();
  const wallets: Array<StateWallet> = useSelector(
    (state: GlobalStateType) => state.wallet.wallets,
  );
  return (
    <AppFrame
      title="My Wallets"
      navigation={<BackButtonRouter />}
      actions={
        <React.Fragment>
          <HomeAction>
            <IconButton
              onClick={() => navigate(getRoute(RouteMap.WalletAdd, {}))}
            >
              <AddIcon />
            </IconButton>
          </HomeAction>
        </React.Fragment>
      }
    >
      <TotalBalanceCard />
      <Heading title="Wallets List" />
      <Stack spacing={2}>
        {wallets.map((item, index) => (
          <WalletItem
            id={`${item.id}`}
            name={item.name}
            type={item.type}
            net={item.networkType}
            tokensCount={item.tokens.length}
            amount={BigInt(item.balance)}
            key={index}
          />
        ))}
      </Stack>
    </AppFrame>
  );
};

export default Wallets;
