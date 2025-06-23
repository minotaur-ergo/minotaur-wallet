import { StateWallet } from '@minotaur-ergo/types';

import TxGenerateContextHandler from '@/components/sign/context/TxGenerateContextHandler';
import TxSignContextHandler from '@/components/sign/context/TxSignContextHandler';

import WalletDAppView from './WalletDAppView';

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
