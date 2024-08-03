import { StateWallet, TokenInfo } from '@/store/reducer/wallet';
import AssetItem from './AssetItem';
import HomeFrame from '@/layouts/HomeFrame';
import ListController from '@/components/list-controller/ListController';

interface WalletAssetPropsType {
  wallet: StateWallet;
}

const WalletAsset = (props: WalletAssetPropsType) => {
  return (
    <HomeFrame id={props.wallet.id} title={props.wallet.name}>
      <ListController<TokenInfo>
        loading={false}
        error={false}
        data={props.wallet.tokens}
        emptyTitle={'You have no assets yet'}
        emptyDescription={'You can issue new asset using Issue Token dApp.'}
        render={(item) => (
          <AssetItem
            id={item.tokenId}
            amount={BigInt(item.balance)}
            network_type={props.wallet.networkType}
          />
        )}
      />
    </HomeFrame>
  );
};

export default WalletAsset;
