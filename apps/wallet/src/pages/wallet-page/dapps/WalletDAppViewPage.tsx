import TxSignContextHandler from '@/components/sign/context/TxSignContextHandler';
import { StateWallet } from '@/store/reducer/wallet';
import WalletDAppView from './WalletDAppView';
import TxGenerateContextHandler from '@/components/sign/context/TxGenerateContextHandler';
interface WalletDAppViewPagePropsType {
  wallet: StateWallet;
}

const WalletDAppViewPage = (props: WalletDAppViewPagePropsType) => (
  <TxGenerateContextHandler wallet={props.wallet}>
    <TxSignContextHandler wallet={props.wallet}>
      <WalletDAppView wallet={props.wallet} />
    </TxSignContextHandler>
  </TxGenerateContextHandler>
);

export default WalletDAppViewPage;
