import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Home from './pages/home/Home';
import Splash from './pages/splash/Splash';
import Wallets from './pages/wallets/Wallets';
import CreateWallet from './pages/createWallet/CreateWallet';
import DApps from './pages/dApps/DApps';

export const RouterMap = {
  Splash: '/v2/',
  Start: '/v2/start',
  Home: '/v2/home',
  DApps: '/v2/dapps',
  Wallets: '/v2/wallets',
  CreateWallet: '/v2/createWallet',
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
          path={RouterMap.Wallets.replace('/v2', '')}
          element={<Wallets />}
        />
        <Route
          path={RouterMap.CreateWallet.replace('/v2', '')}
          element={<CreateWallet />}
        />
      </Routes>
    </AppTheme>
  );
};

export default V2Demo;
