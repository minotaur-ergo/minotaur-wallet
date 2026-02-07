import { useMemo, useState } from 'react';

import { StateWallet, TokenBalance } from '@minotaur-ergo/types';
import { Drawer } from '@mui/material';

import ListController from '@/components/list-controller/ListController';
import HomeFrame from '@/layouts/HomeFrame';
import AssetItemDetail from '@/pages/wallet-page/asset/AssetItemDetail';

import AssetItem from './AssetItem';

interface WalletAssetPropsType {
  wallet: StateWallet;
}

const WalletAsset = (props: WalletAssetPropsType) => {
  const [selected, setSelected] = useState<string | undefined>();
  const balance = useMemo(() => {
    return props.wallet.tokens
      .filter((item) => item.tokenId === selected)
      .reduce((a, b) => a + BigInt(b.balance), 0n);
  }, [props.wallet.tokens, selected]);
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
            handleClick={() => setSelected(item.tokenId)}
          />
        )}
      />
      <Drawer
        anchor="bottom"
        open={selected !== undefined}
        onClose={() => setSelected(undefined)}
      >
        <AssetItemDetail
          id={selected ?? ''}
          network_type={props.wallet.networkType}
          handleClose={() => setSelected(undefined)}
          balance={balance}
        />
      </Drawer>
    </HomeFrame>
  );
};

export default WalletAsset;
