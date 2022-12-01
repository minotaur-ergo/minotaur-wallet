import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Home from './pages/home/Home';
import Splash from './pages/splash/Splash';
import Wallets from './pages/wallets/Wallets';

const V2Demo = () => {
  return (
    <AppTheme>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wallets" element={<Wallets />} />
      </Routes>
    </AppTheme>
  );
};

export default V2Demo;
