import { StateWallet, TokenBalance } from '@minotaur-ergo/types';

import ListController from '@/components/list-controller/ListController';
import HomeFrame from '@/layouts/HomeFrame';

import AssetItem from './AssetItem';

interface WalletAssetPropsType {
  wallet: StateWallet;
}

const WalletAsset = (props: WalletAssetPropsType) => {
  return (
    <HomeFrame id={props.wallet.id} title={props.wallet.name}>
      <ListController<TokenBalance>
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
