import getChain from '@/utils/networks';
import AddressItem from './AddressItem';
import HomeFrame from '@/layouts/HomeFrame';
import ListController from '@/components/list-controller/ListController';
import NewAddress from './NewAddress';
import { StateWallet } from '@/store/reducer/wallet';

interface WalletAddressPropsType {
  wallet: StateWallet;
}

const WalletAddress = (props: WalletAddressPropsType) => {
  const chain = getChain(props.wallet.networkType);
  return (
    <HomeFrame id={props.wallet.id} title={props.wallet.name}>
      <ListController
        loading={false}
        error={false}
        data={props.wallet.addresses}
        divider={false}
        emptyTitle={'You have no address '}
        render={(item) => <AddressItem address={item} chain={chain} />}
      />
      {props.wallet.xPub !== '' ? <NewAddress wallet={props.wallet} /> : null}
    </HomeFrame>
  );
};

export default WalletAddress;
