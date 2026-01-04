import { StateWallet } from '@minotaur-ergo/types';

import TxGenerateContextHandler from '@/components/sign/context/TxGenerateContextHandler';
import TxSignContextHandler from '@/components/sign/context/TxSignContextHandler';

import TxGenerator from './TxGenerator';
import WalletSend from './WalletSend';

interface WalletSendPropsType {
  wallet: StateWallet;
}

const WalletSendPage = (props: WalletSendPropsType) => {
  return (
    <TxGenerateContextHandler wallet={props.wallet}>
      <TxSignContextHandler
        wallet={props.wallet}
        // sendViaNode={() => {}}
      >
        <TxGenerator wallet={props.wallet} />
        <WalletSend wallet={props.wallet} />
      </TxSignContextHandler>
    </TxGenerateContextHandler>
  );
};

export default WalletSendPage;
