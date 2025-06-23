import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GlobalStateType } from '@minotaur-ergo/types';

import { WalletDbAction } from '@/action/db';
import LoadingPage from '@/components/loading-page/LoadingPage';
import AppFrame from '@/layouts/AppFrame';
import { RouteMap, getRoute } from '@/router/routerMap';

const Home = () => {
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const { activeWallet, useActiveWallet } = useSelector(
    (state: GlobalStateType) => state.config,
  );
  const locked = useSelector(
    (state: GlobalStateType) => state.config.pin.locked,
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!locked) {
      if (activeWallet && activeWallet !== -1 && useActiveWallet) {
        const currentWallets = wallets.filter(
          (item) => item.id === activeWallet,
        );
        if (currentWallets.length > 0) {
          navigate(getRoute(RouteMap.WalletHome, { id: activeWallet }), {
            replace: true,
          });
        } else {
          navigate(RouteMap.Wallets, { replace: true });
        }
      } else {
        WalletDbAction.getInstance()
          .getWallets()
          .then((wallets) => {
            if (wallets.length === 0) {
              navigate(RouteMap.Wallets, { replace: true });
              navigate(RouteMap.WalletAdd, { replace: false });
            } else {
              navigate(RouteMap.Wallets, { replace: true });
            }
          });
      }
    }
  });
  return (
    <AppFrame title={''}>
      <LoadingPage />
    </AppFrame>
  );
};

export default Home;
