import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Home from './pages/home/Home';
import Splash from './pages/splash/Splash';
import Wallets from './pages/wallets/Wallets';
import CreateWallet from './pages/addWallet/createWallet/CreateWallet';
import DApps from './pages/dApps/DApps';
import Transactions from './pages/transaction/Transactions';
import Assets from './pages/assets/Assets';
import Addresses from './pages/addresses/Addresses';
import SigmaUSD from './pages/dApps/sigmaUsd/SigmaUSD';
import IssueToken from './pages/dApps/issueToken/IssueToken';
import Send from './pages/send/Send';
import AddWallet from './pages/addWallet/AddWallet';
import MultiSigWallet from './pages/addWallet/multiSigWallet/MultiSigWallet';
import Settings from './pages/settings/Settings';
import WalletChangePassword from './pages/settings/WalletChangePassword';
import AddressBook from './pages/addressBook/AddressBook';
import AddAddress from './pages/addressBook/AddAddress';
import MultiSigCommunication from './pages/multiSigCom/MultiSigCommunication';
import WalletExtendedPublicKey from './pages/settings/WalletExtendedPublicKey';
import MultiSigTransaction from './pages/multiSigCom/MultiSigTransaction';
import Scan from './pages/scan/Scan';
import ErgoPay from './pages/ergpPay/ErgoPay';
import DAppConnector from './pages/dApps/connector/DAppConnector';
import WhiteList from './pages/dApps/whiteList/WhiteList';
import ConnectedDApp from './pages/dApps/connectedDApp/ConnectedDApp';
import Extension from './pages/extension/Extension';
import ExtensionConnector from './pages/extension/ExtensionConnector';
import TransactionDetails from './pages/transaction/TransactionDetails';

export const RouterMap = {
  Splash: '/v2/',
  Start: '/v2/start',
  Home: '/v2/wallet/:id',
  DApps: '/v2/wallet/:id/dapps',
  DAppConnector: '/v2/wallet/:id/dapps/connector',
  WhiteList: '/v2/wallet/:id/dapps/whiteList',
  ConnectedDApp: '/v2/wallet/:id/dapps/whiteList/:dappid',
  IssueToken: '/v2/wallet/dapps/issueToken',
  SigmaUSD: '/v2/wallet/dapps/sigmaUsd',
  Wallets: '/v2/wallets',
  AddWallet: '/v2/wallet/add',
  CreateWallet: '/v2/wallet/add/newWallet',
  RestoreWallet: '/v2/wallet/add/existingWallet',
  AddROWallet: '/v2/wallet/add/readOnlyWallet',
  AddMSWallet: '/v2/wallet/add/multiSigWallet',
  Transactions: '/v2/wallet/transactions',
  TransactionDetails: '/v2/wallet/transactions/:id',
  Assets: '/v2/wallet/assets',
  Addresses: '/v2/wallet/addresses',
  Send: '/v2/wallet/send',
  Scan: '/v2/wallet/scan',
  Settings: '/v2/settings',
  ChangePassword: '/v2/settings/changePassword',
  PublicKey: '/v2/settings/extendedPublicKey',
  AddressBook: '/v2/addressBook',
  AddAddress: '/v2/addressBook/add',
  MultiSigCom: '/v2/multisigCom',
  MultiSigTrans: '/v2/multisigCom/:id',
  ErgoPay: '/v2/ergoPay',
  Extension: '/v2/extension',
  ExtensionConnector: '/v2/extension/connector',
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
          path={RouterMap.AddWallet.replace('/v2', '')}
          element={<AddWallet />}
        />
        <Route
          path={RouterMap.CreateWallet.replace('/v2', '')}
          element={<CreateWallet />}
        />
        <Route
          path={RouterMap.AddMSWallet.replace('/v2', '')}
          element={<MultiSigWallet />}
        />
        <Route
          path={RouterMap.Transactions.replace('/v2', '')}
          element={<Transactions />}
        />
        <Route
          path={RouterMap.TransactionDetails.replace('/v2', '')}
          element={<TransactionDetails />}
        />
        <Route
          path={RouterMap.Assets.replace('/v2', '')}
          element={<Assets />}
        />
        <Route
          path={RouterMap.Addresses.replace('/v2', '')}
          element={<Addresses />}
        />
        <Route path={RouterMap.Send.replace('/v2', '')} element={<Send />} />
        <Route path={RouterMap.Scan.replace('/v2', '')} element={<Scan />} />
        <Route
          path={RouterMap.Settings.replace('/v2', '')}
          element={<Settings />}
        />
        <Route
          path={RouterMap.ChangePassword.replace('/v2', '')}
          element={<WalletChangePassword />}
        />
        <Route
          path={RouterMap.PublicKey.replace('/v2', '')}
          element={<WalletExtendedPublicKey />}
        />
        <Route
          path={RouterMap.AddressBook.replace('/v2', '')}
          element={<AddressBook />}
        />
        <Route
          path={RouterMap.AddAddress.replace('/v2', '')}
          element={<AddAddress />}
        />
        <Route
          path={RouterMap.MultiSigCom.replace('/v2', '')}
          element={<MultiSigCommunication />}
        />
        <Route
          path={RouterMap.MultiSigTrans.replace('/v2', '')}
          element={<MultiSigTransaction />}
        />
        <Route
          path={RouterMap.ErgoPay.replace('/v2', '')}
          element={<ErgoPay />}
        />
        <Route
          path={RouterMap.DAppConnector.replace('/v2', '')}
          element={<DAppConnector />}
        />
        <Route
          path={RouterMap.WhiteList.replace('/v2', '')}
          element={<WhiteList />}
        />
        <Route
          path={RouterMap.ConnectedDApp.replace('/v2', '')}
          element={<ConnectedDApp />}
        />
        <Route
          path={RouterMap.Extension.replace('/v2', '')}
          element={<Extension />}
        />
        <Route
          path={RouterMap.ExtensionConnector.replace('/v2', '')}
          element={<ExtensionConnector />}
        />
      </Routes>
    </AppTheme>
  );
};

export default V2Demo;
