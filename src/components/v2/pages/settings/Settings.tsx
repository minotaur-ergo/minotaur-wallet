import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import WalletSettings from './WalletSettings';
import GlobalSettings from './GlobalSettings';
import DangerousSettings from './DangerousSettings';

const Settings = () => {
  return (
    <AppFrame title="Settings" navigation={<BackButton />}>
      <WalletSettings />
      <GlobalSettings />
      <DangerousSettings />
    </AppFrame>
  );
};

export default Settings;
