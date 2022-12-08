import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Home from './pages/home/Home';
import Splash from './pages/splash/Splash';
import Wallets from './pages/wallets/Wallets';
import CreateWallet from './pages/createWallet/CreateWallet';
import DApps from './pages/dApps/DApps';
import Transactions from './pages/transaction/Transactions';
import Assets from './pages/assets/Assets';
import Addresses from './pages/addresses/Addresses';
import SigmaUSD from './pages/dApps/sigmaUsd/SigmaUSD';
import IssueToken from './pages/dApps/issueToken/IssueToken';

export const RouterMap = {
  Splash: '/v2/',
  Start: '/v2/start',
  Home: '/v2/home',
  DApps: '/v2/wallet/dapps',
  IssueToken: '/v2/wallet/dapps/issueToken',
  SigmaUSD: '/v2/wallet/dapps/sigmaUsd',
  Wallets: '/v2/wallets',
  CreateWallet: '/v2/createWallet',
  Transactions: '/v2/wallet/transactions',
  Assets: '/v2/wallet/assets',
  Addresses: '/v2/wallet/addresses',
};

const V2Demo = () => {
  return (
    <AppTheme>
      <Routes>
        <Route
          path={RouterMap.Splash.replace('/v2', '')}
          element={<Splash />}
        />
        <Route path={RouterMap.Home.replace('/v2', '')} element={<Home />} />
        <Route path={RouterMap.DApps.replace('/v2', '')} element={<DApps />} />
        <Route
          path={RouterMap.IssueToken.replace('/v2', '')}
          element={<IssueToken />}
        />
        <Route
          path={RouterMap.SigmaUSD.replace('/v2', '')}
          element={<SigmaUSD />}
        />
        <Route
          path={RouterMap.Wallets.replace('/v2', '')}
          element={<Wallets />}
        />
        <Route
          path={RouterMap.CreateWallet.replace('/v2', '')}
          element={<CreateWallet />}
        />
        <Route
          path={RouterMap.Transactions.replace('/v2', '')}
          element={<Transactions />}
        />
        <Route
          path={RouterMap.Assets.replace('/v2', '')}
          element={<Assets />}
        />
        <Route
          path={RouterMap.Addresses.replace('/v2', '')}
          element={<Addresses />}
        />
      </Routes>
    </AppTheme>
  );
};

export default V2Demo;
