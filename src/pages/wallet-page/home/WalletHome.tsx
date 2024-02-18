import { WalletType } from '@/db/entities/Wallet';
import HomeFrame from '@/layouts/HomeFrame';
import { StateWallet } from '@/store/reducer/wallet';
import MultiSigCommunicationButton from './MultiSigCommunicationButton';
import RecentTransactions from './RecentTransactions';
import WalletCard from './WalletCard';

interface WalletHomePropsType {
  wallet: StateWallet;
}

const WalletHome = (props: WalletHomePropsType) => {
  return (
    <HomeFrame title={props.wallet.name} id={props.wallet.id}>
      <WalletCard wallet={props.wallet} />
      {props.wallet.type === WalletType.MultiSig ? (
        <MultiSigCommunicationButton walletId={props.wallet.id} />
      ) : null}
      <RecentTransactions wallet={props.wallet} />
    </HomeFrame>
  );
};

export default WalletHome;
