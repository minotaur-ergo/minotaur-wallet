import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ConfigType, GlobalStateType, StateWallet } from '@minotaur-ergo/types';
import { Add } from '@mui/icons-material';
import { FormControlLabel, IconButton, Stack, Switch } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import Heading from '@/components/heading/Heading';
import SubHeading from '@/components/heading/SubHeading';
import HomeAction from '@/components/home-action/HomeAction';
import AppFrame from '@/layouts/AppFrame';
import { getRoute, RouteMap } from '@/router/routerMap';
import store from '@/store';
import { setDisplayArchived } from '@/store/reducer/config';

import TotalBalanceCard from './components/TotalBalanceCard';
import WalletItem from './components/WalletItem';

const Wallets = () => {
  const navigate = useNavigate();
  const showArchived = useSelector(
    (state: GlobalStateType) => state.config.displayArchived,
  );
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.loadedPinType,
  );
  const wallets: Array<StateWallet> = useSelector(
    (state: GlobalStateType) => state.wallet.wallets,
  );
  const { activeWallet, useActiveWallet } = useSelector(
    (state: GlobalStateType) => state.config,
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

  const showBackBtn = useMemo(() => {
    return !!(
      wallets.length > 0 &&
      activeWallet &&
      activeWallet !== -1 &&
      useActiveWallet
    );
  }, [wallets, activeWallet, useActiveWallet]);
  const setShowArchived = useCallback(
    (newState: boolean) => {
      if (newState !== showArchived) {
        store.dispatch(setDisplayArchived(newState));
        ConfigDbAction.getInstance()
          .setConfig(
            ConfigType.DisplayArchived,
            newState ? 'true' : 'false',
            activePinType,
          )
          .then(() => null);
      }
    },
    [showArchived, activePinType],
  );
  return (
    <AppFrame
      title="My Wallets"
      navigation={showBackBtn ? <BackButtonRouter /> : undefined}
      actions={
        <React.Fragment>
          <HomeAction>
            <IconButton
              onClick={() => navigate(getRoute(RouteMap.WalletAdd, {}))}
            >
              <Add />
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
            {favoriteWallets.map((item) => (
              <WalletItem
                id={`${item.id}`}
                name={item.name}
                type={item.type}
                net={item.networkType}
                tokensCount={item.tokens.length}
                amount={BigInt(item.balance)}
                key={item.id}
                archived={item.archived}
                favorite={item.favorite}
                tokensBalance={item.tokens}
              />
            ))}
          </Stack>
          {otherWallets.length > 0 && <SubHeading title="Others" />}
        </React.Fragment>
      )}
      <Stack spacing={2}>
        {otherWallets.map((item) => (
          <WalletItem
            id={`${item.id}`}
            name={item.name}
            type={item.type}
            net={item.networkType}
            tokensCount={item.tokens.length}
            amount={BigInt(item.balance)}
            key={item.id}
            archived={item.archived}
            favorite={item.favorite}
            tokensBalance={item.tokens}
          />
        ))}
      </Stack>
    </AppFrame>
  );
};

export default Wallets;
