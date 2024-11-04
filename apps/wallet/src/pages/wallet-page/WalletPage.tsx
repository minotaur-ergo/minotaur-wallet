import { MultiSigCommunicationRegister } from '@/pages/wallet-page/multi-sig/MultiSigCommunicationRegister';
import MultiSigTransactionServerPage from '@/pages/wallet-page/multi-sig/MultiSigTransactionServerPage';
import WalletTransactionDetails from '@/pages/wallet-page/transaction/WalletTransactionDetail';
import { useEffect, useState } from 'react';
import { GlobalStateType } from '@/store';
import { useSelector } from 'react-redux';
import { Route, Routes, useParams } from 'react-router-dom';
import { WalletPageSuffix } from '@/router/routerMap';
import WalletAddress from './address/WalletAddress';
import WalletAsset from './asset/WalletAsset';
import WalletDApps from './dapps/WalletDApps';
import WalletHome from './home/WalletHome';
import MultiSigCommunication from './multi-sig/MultiSigCommunication';
import MultiSigTransactionLocalPage from './multi-sig/MultiSigTransactionLocalPage';
import WalletSendPage from './send/WalletSendPage';
import WalletTransaction from './transaction/WalletTransaction';
import { StateWallet } from '@/store/reducer/wallet';
import WalletSettings from '../settings/Settings';
import WalletExtendedPublicKey from '../settings/WalletExtendedPublicKey';
import WalletDAppViewPage from './dapps/WalletDAppViewPage';

const WalletPage = () => {
  const { id } = useParams();
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  useEffect(() => {
    const selected = wallets.filter((item) => `${item.id}` === id);
    if (selected.length > 0) {
      if (
        wallet === undefined ||
        wallet.id !== selected[0].id ||
        wallet.balance !== selected[0].balance ||
        wallet.name !== selected[0].name ||
        wallet.addresses.length !== selected[0].addresses.length
      ) {
        setWallet(selected[0]);
      }
    } else {
      if (wallet !== undefined) {
        setWallet(undefined);
      }
    }
  }, [wallets, id, wallet]);
  if (wallet === undefined) {
    return null;
  }
  return (
    <Routes>
      <Route
        path={WalletPageSuffix.WalletMultiSigRegistration}
        element={<MultiSigCommunicationRegister wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletMultiSig}
        element={<MultiSigCommunication wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletMultiSigTxView}
        element={<MultiSigTransactionLocalPage wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletHome}
        element={<WalletHome wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletTransaction}
        element={<WalletTransaction wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletTransactionDetail}
        element={<WalletTransactionDetails wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletAddress}
        element={<WalletAddress wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletAsset}
        element={<WalletAsset wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletDApps}
        element={<WalletDApps wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletSettings}
        element={<WalletSettings wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletXPub}
        element={<WalletExtendedPublicKey wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletSend}
        element={<WalletSendPage wallet={wallet} />}
      />
      <Route
        path={WalletPageSuffix.WalletDAppView}
        element={<WalletDAppViewPage wallet={wallet} />}
      />
    </Routes>
  );
};
export default WalletPage;
