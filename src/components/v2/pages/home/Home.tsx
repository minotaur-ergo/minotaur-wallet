import React from 'react';
import RecentTransactions from './RecentTransactions';
import WalletCard from './WalletCard';
import HomeFrame from '../../layouts/HomeFrame';
import MultiSigCommunicationButton from './MultiSigCommunicationButton';

const Home = () => {
  return (
    <HomeFrame>
      <WalletCard />
      <MultiSigCommunicationButton />
      <RecentTransactions />
    </HomeFrame>
  );
};

export default Home;
