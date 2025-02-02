import SubHeading from '@/components/heading/SubHeading';
import { FormControlLabel, IconButton, Stack, Switch } from '@mui/material';
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
import React, { useMemo, useState } from 'react';
import HomeAction from '@/components/home-action/HomeAction';

const Wallets = () => {
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const wallets: Array<StateWallet> = useSelector(
    (state: GlobalStateType) => state.wallet.wallets,
  );
  const [favoriteWallets, otherWallets] = useMemo(() => {
    const filteredWalletsByArchive = wallets.filter(
      (row) => showArchived || !row.archived,
    );
    return [
      filteredWalletsByArchive.filter((row) => row.favorite),
      filteredWalletsByArchive.filter((row) => !row.favorite),
    ];
  }, [showArchived, wallets]);

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
      <Heading
        title="Wallets List"
        customActions={
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
            }
            label={<small>Show archived</small>}
          />
        }
      />
      {favoriteWallets.length > 0 && (
        <React.Fragment>
          <SubHeading title="Favorites" disableTopGutter />
          <Stack spacing={2}>
            {favoriteWallets.map((item, index) => (
              <WalletItem
                id={`${item.id}`}
                name={item.name}
                type={item.type}
                net={item.networkType}
                tokensCount={item.tokens.length}
                amount={BigInt(item.balance)}
                key={index}
                archived={item.archived}
                favorite={item.favorite}
              />
            ))}
          </Stack>
          {otherWallets.length > 0 && <SubHeading title="Others" />}
        </React.Fragment>
      )}
      <Stack spacing={2}>
        {otherWallets.map((item, index) => (
          <WalletItem
            id={`${item.id}`}
            name={item.name}
            type={item.type}
            net={item.networkType}
            tokensCount={item.tokens.length}
            amount={BigInt(item.balance)}
            key={index}
            archived={item.archived}
            favorite={item.favorite}
          />
        ))}
      </Stack>
    </AppFrame>
  );
};

export default Wallets;
