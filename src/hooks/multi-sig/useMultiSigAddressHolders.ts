import { deriveAddressFromXPub } from '@/action/address';
import { MultiSigDbAction } from '@/action/db';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigAddressHolder } from '@/types/multi-sig';
import { bip32, createEmptyArrayWithIndex } from '@/utils/functions';
import getChain from '@/utils/networks';
import { useEffect, useState } from 'react';

const useMultiSigAddressHolders = (
  loadingWallet: StateWallet,
): Array<MultiSigAddressHolder> => {
  const [result, setResult] = useState<Array<MultiSigAddressHolder>>([]);
  const [loadedWalletData, setLoadedWalletData] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) {
      const indexes = loadingWallet.addresses.map((item) => item.idx);
      const wallet = loadingWallet;
      const walletData = [...indexes, wallet.id];
      if (JSON.stringify(walletData) !== loadedWalletData) {
        const chain = getChain(wallet.networkType);
        MultiSigDbAction.getInstance()
          .getWalletKeys(wallet.id)
          .then((keys) => {
            const result = keys
              .map((xPub) => xPub.extended_key)
              .map((xPub) => {
                const address = deriveAddressFromXPub(
                  xPub,
                  chain.prefix,
                  0,
                ).address;
                const pub = bip32.fromBase58(xPub);
                const maxIndex = Math.max(
                  ...wallet.addresses.map((item) => item.idx),
                );
                const pubKeys = createEmptyArrayWithIndex(maxIndex + 1).map(
                  (index) => {
                    const derived1 = pub.derive(index);
                    return derived1.publicKey.toString('hex');
                  },
                );
                return { address, xPub, pubKeys };
              });
            setResult(
              result.sort((a, b) => a.address.localeCompare(b.address)),
            );
            setLoadedWalletData(JSON.stringify(walletData));
            setLoading(false);
          });
      }
    }
  });
  return result;
};

export default useMultiSigAddressHolders;
