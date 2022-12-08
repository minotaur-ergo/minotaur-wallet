import React from 'react';
import RecentTransactions from './RecentTransactions';
import WalletCard from './WalletCard';
import HomeFrame from '../../layouts/HomeFrame';

const Home = () => {
  return (
    <HomeFrame>
      <WalletCard />
      <RecentTransactions />
    </HomeFrame>
  );
};

export default Home;
