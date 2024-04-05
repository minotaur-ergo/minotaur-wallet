import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import WalletSettings from './WalletSettings';
import GlobalSettings from './GlobalSettings';
import DangerousSettings from './DangerousSettings';
import AppVersion from './AppVersion';

const Settings = () => {
  return (
    <AppFrame title="Settings" navigation={<BackButton />}>
      <WalletSettings />
      <GlobalSettings />
      <DangerousSettings />
      <AppVersion />
    </AppFrame>
  );
};

export default Settings;
