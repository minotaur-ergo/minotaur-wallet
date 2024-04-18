import React from 'react';
import RecentTransactions from './RecentTransactions';
import WalletCard from './WalletCard';
import HomeFrame from '../../layouts/HomeFrame';
import MultiSigCommunicationButton from './MultiSigCommunicationButton';
import { useParams } from 'react-router-dom';
import { WALLETS } from '../../data';

const Home = () => {
  const { id } = useParams();
  const wallet = WALLETS.find((row) => row.id === id);
  const isMultiSig = wallet?.type === 'Multi-signature Wallet';

  return (
    <HomeFrame>
      <WalletCard />
      {isMultiSig && <MultiSigCommunicationButton />}
      <RecentTransactions />
    </HomeFrame>
  );
};

export default Home;
