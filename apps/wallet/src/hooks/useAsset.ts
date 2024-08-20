import { AssetDbAction } from '@/action/db';
import Asset from '@/db/entities/Asset';
import { useEffect, useState } from 'react';

interface AssetType {
  asset?: Asset;
  loading: boolean;
  loadedId: string;
  networkType: string;
}

const useAsset = (tokenId: string, networkType: string) => {
  const [asset, setAsset] = useState<AssetType>({
    networkType: '',
    loading: false,
    loadedId: '',
  });
  useEffect(() => {
    if (
      !asset.loading &&
      tokenId !== 'erg' &&
      (asset.loadedId !== tokenId || asset.networkType !== networkType)
    ) {
      setAsset({ ...asset, loading: true });
      AssetDbAction.getInstance()
        .getAssetByAssetId(tokenId, networkType)
        .then((res) => {
          setAsset({
            asset: res ? res : undefined,
            networkType: networkType,
            loadedId: tokenId,
            loading: false,
          });
        });
    }
  }, [asset, tokenId, networkType]);
  return asset.asset;
};

export default useAsset;
