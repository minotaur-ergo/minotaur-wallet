import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import Heading from '../../components/Heading';
import WalletSettings from './WalletSettings';

const Settings = () => {
  return (
    <AppFrame title="Settings" navigation={<BackButton />}>
      <WalletSettings />
      <Heading title="Global Settings" />
    </AppFrame>
  );
};

export default Settings;
