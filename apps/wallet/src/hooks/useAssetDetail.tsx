import React from 'react';
import { useEffect, useState } from 'react';
import { tokens } from '@minotaur-ergo/icons';
import { AssetDbAction } from '@/action/db';

const useAssetDetail = (assetId: string, networkType: string) => {
  const [details, setDetails] = useState<{
    name: string;
    logoPath?: string;
    logo?: React.ReactElement;
    description: string;
    decimal: number;
    emissionAmount: bigint;
    txId: string;
    tokenId: string;
  }>({
    name: '',
    decimal: 0,
    description: '',
    txId: '',
    emissionAmount: -1n,
    tokenId: '-',
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading && assetId !== details.tokenId) {
      setLoading(true);
      if (assetId === '') {
        const logoPath = `/ergo.svg`;
        setDetails({
          name: 'Erg',
          logoPath: logoPath,
          logo: (
            <img
              alt="ergo"
              src={logoPath}
              style={{ width: '100%', height: '100%' }}
            />
          ),
          decimal: 9,
          txId: '',
          description: '',
          emissionAmount: 0n,
          tokenId: '',
        });
        console.log('we are here');
        setLoading(false);
        return;
      }
      const saved = tokens[assetId];
      if (saved) {
        const logoPath = `/icons/${saved.id}.${saved.fileExtension}`;

        setDetails({
          name: saved.name,
          decimal: saved.decimals,
          description: saved.description,
          emissionAmount: BigInt(saved.emissionAmount),
          tokenId: saved.id,
          txId: saved.txId,
          logoPath: logoPath,
          logo: (
            <img
              alt={saved.name}
              src={logoPath}
              style={{ width: '100%', height: '100%' }}
            />
          ),
        });
        setLoading(false);
      } else {
        AssetDbAction.getInstance()
          .getAssetByAssetId(assetId, networkType)
          .then((asset) => {
            if (asset) {
              const decimal = asset.decimal ? asset.decimal : 0;
              setDetails({
                name: asset.name ? asset.name : assetId.substring(0, 6),
                description: asset.description ? asset.description : '',
                decimal,
                emissionAmount: asset.emission_amount
                  ? BigInt(asset.emission_amount)
                  : 0n,
                txId: asset.tx_id ? asset.tx_id : '',
                tokenId: assetId,
              });
            } else {
              setDetails({
                name: assetId.substring(0, 6),
                description: '',
                decimal: 0,
                emissionAmount: -1n,
                txId: '',
                tokenId: assetId,
              });
            }
            setLoading(false);
          });
      }
    }
  }, [assetId, networkType, details.tokenId, loading]);
  return details;
};

export default useAssetDetail;
