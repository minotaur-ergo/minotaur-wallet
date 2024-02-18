import AppFrame from '@/layouts/AppFrame';
import LocalSettings from './LocalSettings';
import DangerousSettings from './DangerousSettings';
import { StateWallet } from '@/store/reducer/wallet';
import GlobalSettings from './GlobalSettings';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

interface WalletSettingsPropsType {
  wallet?: StateWallet;
}

const WalletSettings = (props: WalletSettingsPropsType) => {
  return (
    <AppFrame title="Settings" navigation={<BackButtonRouter />}>
      {props.wallet ? <LocalSettings wallet={props.wallet} /> : undefined}
      <GlobalSettings />
      {props.wallet ? <DangerousSettings wallet={props.wallet} /> : undefined}
    </AppFrame>
  );
};

export default WalletSettings;
