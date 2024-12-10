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
import AddAddress from './pages/addressBook/add/AddAddress';
import MultiSigCommunication from './pages/multiSig/communication/MultiSigCommunication';
import WalletExtendedPublicKey from './pages/settings/WalletExtendedPublicKey';
import MultiSigTransaction from './pages/multiSig/transaction/MultiSigTransaction';
import Scan from './pages/scan/Scan';
import ErgoPay from './pages/ergpPay/ErgoPay';
import DAppConnector from './pages/dApps/connector/DAppConnector';
import WhiteList from './pages/dApps/whiteList/WhiteList';
import ConnectedDApp from './pages/dApps/connectedDApp/ConnectedDApp';
import Extension from './pages/extension/Extension';
import ExtensionConnector from './pages/extension/ExtensionConnector';
import TransactionDetails from './pages/transaction/TransactionDetails';
import BoxConsolidation from './pages/dApps/boxConsolidation/BoxConsolidation';
import WalletSetPin from './pages/settings/WalletSetPin';
import EnterPin from './pages/enterPin/EnterPin';
import ExportAddresses from './pages/addressBook/export/ExportAddresses';
import ImportAddresses from './pages/addressBook/import/ImportAddresses';
import ExportAsset from './pages/assets/export/ExportAsset';
import MultiSigRegistration from './pages/multiSig/registration/MultiSigRegistration';
import ExportWallet from './pages/wallets/export/ExportWallet';

export const RouterMap = {
  Splash: '/v2/',
  Start: '/v2/start',
  EnterPin: '/v2/enterPin',
  Home: '/v2/wallet/:id',
  DApps: '/v2/wallet/:id/dapps',
  DAppConnector: '/v2/wallet/:id/dapps/connector',
  WhiteList: '/v2/wallet/:id/dapps/whiteList',
  ConnectedDApp: '/v2/wallet/:id/dapps/whiteList/:dappid',
  IssueToken: '/v2/wallet/dapps/issueToken',
  SigmaUSD: '/v2/wallet/dapps/sigmaUsd',
  BoxConsolidation: '/v2/wallet/dapps/boxConsolidation',
  Wallets: '/v2/wallets',
  AddWallet: '/v2/wallet/add',
  ExportWallet: '/v2/wallet/export',
  CreateWallet: '/v2/wallet/add/newWallet',
  RestoreWallet: '/v2/wallet/add/existingWallet',
  AddROWallet: '/v2/wallet/add/readOnlyWallet',
  AddMSWallet: '/v2/wallet/add/multiSigWallet',
  Transactions: '/v2/wallet/transactions',
  TransactionDetails: '/v2/wallet/transactions/:id',
  Assets: '/v2/wallet/assets',
  ExportAsset: '/v2/wallet/assets/export',
  ImportAsset: '/v2/wallet/assets/import',
  Addresses: '/v2/wallet/addresses',
  Send: '/v2/wallet/send',
  Scan: '/v2/wallet/scan',
  Settings: '/v2/settings',
  ChangePassword: '/v2/settings/changePassword',
  PublicKey: '/v2/settings/extendedPublicKey',
  SetPin: '/v2/settings/setPin',
  AddressBook: '/v2/addressBook',
  AddAddress: '/v2/addressBook/add',
  ExportAddress: '/v2/addressBook/export',
  ImportAddress: '/v2/addressBook/import',
  MultiSigReg: '/v2/multisig/registration',
  MultiSigCom: '/v2/multisig/communication',
  MultiSigTrans: '/v2/multisig/communication/:id',
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
          path={RouterMap.ExportWallet.replace('/v2', '')}
          element={<ExportWallet />}
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
          path={RouterMap.ExportAsset.replace('/v2', '')}
          element={<ExportAsset />}
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
          path={RouterMap.SetPin.replace('/v2', '')}
          element={<WalletSetPin />}
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
          path={RouterMap.ExportAddress.replace('/v2', '')}
          element={<ExportAddresses />}
        />
        <Route
          path={RouterMap.ImportAddress.replace('/v2', '')}
          element={<ImportAddresses />}
        />
        <Route
          path={RouterMap.MultiSigReg.replace('/v2', '')}
          element={<MultiSigRegistration />}
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
          path={RouterMap.BoxConsolidation.replace('/v2', '')}
          element={<BoxConsolidation />}
        />
        <Route
          path={RouterMap.Extension.replace('/v2', '')}
          element={<Extension />}
        />
        <Route
          path={RouterMap.ExtensionConnector.replace('/v2', '')}
          element={<ExtensionConnector />}
        />
        <Route
          path={RouterMap.EnterPin.replace('/v2', '')}
          element={<EnterPin />}
        />
      </Routes>
    </AppTheme>
  );
};

export default V2Demo;
