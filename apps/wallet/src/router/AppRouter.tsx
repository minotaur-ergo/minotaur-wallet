import React from 'react';
import AppHoneyPin from '@/pages/settings/AppHoneyPin';
import AppPin from '@/pages/settings/AppPin';
import EnterPin from '@/pages/wallet-page/enter-pin/EnterPin';
import { GlobalStateType } from '@/store';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import useInitConfig from '@/hooks/useInitConfig';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import useUpdater from '@/hooks/useUpdater';
import WalletAddMultiSig from '@/pages/wallet-add/multi-sig-wallet/WalletAddMultiSig';
import WalletAddNew from '@/pages/wallet-add/new-wallet/WalletAddNew';
import WalletReadOnly from '@/pages/wallet-add/read-only-wallet/WalletReadOnly';
import WalletRestore from '@/pages/wallet-add/restore-wallet/WalletRestore';
import WalletAdd from '@/pages/wallet-add/WalletAdd';
import AddressBook from '@/pages/wallet-page/address-book/AddressBook';
import AddSavedAddress from '@/pages/wallet-page/address-book/AddSavedAddress';
import { RouteMap } from './routerMap';
import Wallets from '@/pages/wallets/Wallets';
import Home from '@/pages/home/Home';
import Splash from '@/components/splash/Splash';
import WalletPage from '@/pages/wallet-page/WalletPage';
import Settings from '@/pages/settings/Settings';

const AppRouter = () => {
  const { initialized } = useInitConfig();
  useUpdater();
  usePriceUpdate();
  const { hasPin, locked } = useSelector(
    (state: GlobalStateType) => state.config.pin,
  );
  console.log(hasPin, locked);
  return initialized ? (
    <React.Fragment>
      {hasPin && locked ? <EnterPin /> : undefined}
      <div style={{ display: hasPin && locked ? 'none' : 'block' }}>
        <Routes>
          <Route path={RouteMap.Wallets} element={<Wallets />} />
          <Route path={RouteMap.Wallet} element={<WalletPage />} />
          <Route path={RouteMap.WalletAdd} element={<WalletAdd />} />
          <Route path={RouteMap.WalletAddNew} element={<WalletAddNew />} />
          <Route path={RouteMap.WalletAddRestore} element={<WalletRestore />} />
          <Route
            path={RouteMap.WalletAddReadOnly}
            element={<WalletReadOnly />}
          />
          <Route path={RouteMap.Settings} element={<Settings />} />
          <Route path={RouteMap.Pin} element={<AppPin />} />
          <Route path={RouteMap.HoneyPin} element={<AppHoneyPin />} />
          <Route
            path={RouteMap.WalletAddMultiSig}
            element={<WalletAddMultiSig />}
          />
          <Route path={RouteMap.AddressBook} element={<AddressBook />} />
          <Route
            path={RouteMap.WalletAddressBookAdd}
            element={<AddSavedAddress />}
          />
          <Route path={RouteMap.Home} element={<Home />} />
        </Routes>
      </div>
    </React.Fragment>
  ) : (
    <Splash />
  );
};

export default AppRouter;
