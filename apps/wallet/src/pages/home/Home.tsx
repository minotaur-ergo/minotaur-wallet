import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WalletDbAction } from '@/action/db';
import { GlobalStateType } from '@/store';
import { useNavigate } from 'react-router-dom';
import { getRoute, RouteMap } from '@/router/routerMap';
import AppFrame from '@/layouts/AppFrame';
import LoadingPage from '@/components/loading-page/LoadingPage';

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
