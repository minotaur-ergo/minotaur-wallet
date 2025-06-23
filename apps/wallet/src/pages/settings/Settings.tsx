import { StateWallet } from '@minotaur-ergo/types';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import AppFrame from '@/layouts/AppFrame';

import AppVersion from './AppVersion';
import DangerousSettings from './DangerousSettings';
import GlobalSettings from './GlobalSettings';
import LocalSettings from './LocalSettings';

interface WalletSettingsPropsType {
  wallet?: StateWallet;
}

const WalletSettings = (props: WalletSettingsPropsType) => {
  return (
    <AppFrame title="Settings" navigation={<BackButtonRouter />}>
      {props.wallet ? <LocalSettings wallet={props.wallet} /> : undefined}
      <GlobalSettings />
      {props.wallet ? <DangerousSettings wallet={props.wallet} /> : undefined}
      <AppVersion />
    </AppFrame>
  );
};

export default WalletSettings;
