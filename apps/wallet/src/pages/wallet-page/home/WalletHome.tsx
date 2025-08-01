import { StateWallet, WalletType } from '@minotaur-ergo/types';

import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import HomeFrame from '@/layouts/HomeFrame';

import MultiSigCommunicationButton from './MultiSigCommunicationButton';
import RecentTransactions from './RecentTransactions';
import WalletCard from './WalletCard';

interface WalletHomePropsType {
  wallet: StateWallet;
}

const WalletHome = (props: WalletHomePropsType) => {
  const signer = useSignerWallet(props.wallet);
  return (
    <HomeFrame title={props.wallet.name} id={props.wallet.id}>
      <WalletCard wallet={props.wallet} />
      {props.wallet.type === WalletType.MultiSig &&
      signer &&
      signer.type === WalletType.Normal ? (
        <MultiSigCommunicationButton walletId={props.wallet.id} />
      ) : null}
      <RecentTransactions wallet={props.wallet} />
    </HomeFrame>
  );
};

export default WalletHome;
