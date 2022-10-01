import React, { useEffect, useState } from 'react';
import {
  NavigateFunction,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Wallet from '../../../db/entities/Wallet';
import { GlobalStateType } from '../../../store/reducer';
import { connect } from 'react-redux';
import QrCodeReaderView from '../../qrcode/QrCodeReaderView';
import WithAppBar from '../../../layout/WithAppBar';
import AppHeader from '../../app-header/AppHeader';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  AssistantOutlined,
  ContactMailOutlined,
  FormatListBulletedOutlined,
  ReceiptOutlined,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { getRoute, RouteMap, WalletPageSuffix } from '../../route/routerMap';
import Transaction from '../transaction/Transaction';
import DAppList from '../dapps/DAppList';
import DAppView from '../dapps/DAppView';
import AssetList from '../asset/AssetList';
import AddressList from '../address/AddressList';
import SendTransaction from '../send/SendTransaction';
import { WalletQrCodeContext } from './types';

const TABS = ['transaction', 'send', 'address', 'assets', 'dApps'];

interface PropsType {
  wallets: Array<Wallet>;
}

const gotoPage = (navigate: NavigateFunction, page_url: string) => () => {
  try {
    navigate(page_url, { replace: true });
  } catch (e) {
    navigate(page_url);
  }
};

const WalletPage = (props: PropsType) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<Wallet>();
  const [tabs, setTabs] = useState({ show: true, active: '' });
  const [scanned, setScanned] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const tabIndex = TABS.indexOf(tabs.active);
  useEffect(() => {
    if (!wallet || wallet.id + '' !== params.id) {
      const wallets = props.wallets.filter(
        (item) => '' + item.id === '' + params.id
      );
      if (wallets.length === 0) {
        gotoPage(navigate, RouteMap.Home);
      }
      setWallet(wallets[0]);
    }
  }, [navigate, params.id, props, wallet]);

  const setCurrentTab = (name: string) => {
    if (!tabs.show || name !== tabs.active) {
      setTabs({ show: true, active: name });
    }
  };

  const hideTab = () => {
    if (tabs.show) {
      setTabs({ show: false, active: '' });
    }
  };
  return (
    <QrCodeReaderView
      fail={() => setShowQrCode(false)}
      success={(scanned) => setScanned(scanned)}
      open={showQrCode}
      close={() => setShowQrCode(false)}
    >
      <WalletQrCodeContext.Provider
        value={{
          qrCode: showQrCode,
          showQrCode: setShowQrCode,
          value: scanned,
          cleanValue: () => setScanned(''),
        }}
      >
        <WithAppBar
          hide={!tabs.show}
          header={
            <AppHeader
              hideQrCode={false}
              openQrCode={() => setShowQrCode(true)}
              title={wallet ? wallet.name : ''}
            />
          }
        >
          <div>
            {wallet ? (
              <Routes>
                <Route
                  path={WalletPageSuffix.WalletTransaction}
                  element={
                    <Transaction wallet={wallet} setTab={setCurrentTab} />
                  }
                />
                <Route
                  path={WalletPageSuffix.WalletSend}
                  element={
                    <SendTransaction wallet={wallet} setTab={setCurrentTab} />
                  }
                />
                <Route
                  path={WalletPageSuffix.WalletAddress}
                  element={
                    <AddressList wallet={wallet} setTab={setCurrentTab} />
                  }
                />
                <Route
                  path={WalletPageSuffix.WalletAssets}
                  element={<AssetList wallet={wallet} setTab={setCurrentTab} />}
                />
                <Route
                  path={WalletPageSuffix.WalletDApps}
                  element={<DAppList wallet={wallet} setTab={setCurrentTab} />}
                />
                <Route
                  path={WalletPageSuffix.WalletDAppView}
                  element={<DAppView wallet={wallet} setTab={hideTab} />}
                />
              </Routes>
            ) : null}
          </div>
          {tabs.show && wallet ? (
            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation value={tabIndex} showLabels>
                <BottomNavigationAction
                  onClick={gotoPage(
                    navigate,
                    getRoute(RouteMap.WalletTransaction, { id: params.id })
                  )}
                  label="Transactions"
                  icon={<FormatListBulletedOutlined />}
                />
                <BottomNavigationAction
                  onClick={gotoPage(
                    navigate,
                    getRoute(RouteMap.WalletSend, { id: params.id })
                  )}
                  label="Send"
                  icon={<ReceiptOutlined />}
                />
                <BottomNavigationAction
                  onClick={gotoPage(
                    navigate,
                    getRoute(RouteMap.WalletAddress, { id: params.id })
                  )}
                  label="Addresses"
                  icon={<ContactMailOutlined />}
                />
                <BottomNavigationAction
                  onClick={gotoPage(
                    navigate,
                    getRoute(RouteMap.WalletAssets, { id: params.id })
                  )}
                  label="Assets"
                  icon={<AccountBalanceWallet />}
                />
                <BottomNavigationAction
                  onClick={gotoPage(
                    navigate,
                    getRoute(RouteMap.WalletDApps, { id: params.id })
                  )}
                  label="dApps"
                  icon={<AssistantOutlined />}
                />
              </BottomNavigation>
            </Paper>
          ) : null}
        </WithAppBar>
      </WalletQrCodeContext.Provider>
    </QrCodeReaderView>
  );
};

const mapsPropsToDispatch = (state: GlobalStateType) => ({
  wallets: state.wallet.wallets,
});

export default connect(mapsPropsToDispatch)(WalletPage);
