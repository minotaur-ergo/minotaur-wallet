import { useEffect, useState } from 'react';

import { WalletType } from '@minotaur-ergo/types';
import { bip32, RootPathWithoutIndex } from '@minotaur-ergo/utils';
import { mnemonicToSeedSync } from 'bip39';

import { WalletDbAction } from '@/action/db';

interface MnemonicValid {
  valid: boolean;
  exists: boolean;
  name?: string;
  remainingWordCount: number;
  readOnlyWalletId?: number;
}

const useMnemonicValid = (
  mnemonic: string,
  passPhrase: string,
  networkType: string,
): MnemonicValid => {
  const [result, setResult] = useState<MnemonicValid>({
    valid: false,
    exists: false,
    name: '',
    remainingWordCount: 0,
  });
  useEffect(() => {
    const mnemonicWords = mnemonic.split(' ');
    const requiredWordCount =
      Math.max(4, Math.ceil(mnemonicWords.length / 3)) * 3;
    if (requiredWordCount === mnemonicWords.length) {
      try {
        const seed = mnemonicToSeedSync(mnemonic, passPhrase);
        const master = bip32.fromSeed(seed);
        const extended_public_key = master
          .derivePath(RootPathWithoutIndex)
          .neutered();
        const pub = extended_public_key.publicKey.toString('hex');
        const chainCode = extended_public_key.chainCode.toString('hex');
        WalletDbAction.getInstance()
          .getWallets()
          .then((wallets) => {
            const readOnly = wallets.filter((item) => {
              if (
                item.type === WalletType.ReadOnly &&
                item.network_type === networkType &&
                item.extended_public_key
              ) {
                const xpub = bip32.fromBase58(item.extended_public_key);
                return (
                  xpub.publicKey.toString('hex') === pub &&
                  xpub.chainCode.toString('hex') === chainCode
                );
              }
              return false;
            });
            setResult({
              valid: true,
              exists: readOnly.length > 0,
              name: readOnly.length > 0 ? readOnly[0].name : '',
              remainingWordCount: 0,
              readOnlyWalletId:
                readOnly.length > 0 ? readOnly[0].id : undefined,
            });
          });
      } catch (exp) {
        console.log(exp);
        setResult({ valid: false, exists: false, remainingWordCount: 0 });
      }
    } else {
      setResult({
        exists: false,
        valid: false,
        remainingWordCount: requiredWordCount - mnemonicWords.length,
      });
    }
  }, [mnemonic, passPhrase, networkType]);
  return result;
};

export default useMnemonicValid;
