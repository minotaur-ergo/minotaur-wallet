import { StateWallet, WalletType } from '@minotaur-ergo/types';

import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';

interface SignButtonLabelPropsType {
  wallet: StateWallet;
}

const SignButtonLabel = (props: SignButtonLabelPropsType) => {
  const signer = useSignerWallet(props.wallet);
  if (
    props.wallet.type === WalletType.ReadOnly ||
    (signer !== undefined && signer.type == WalletType.ReadOnly)
  )
    return 'Scan Signed';
  if (props.wallet.type === WalletType.Normal) return 'Sign';
  if (props.wallet.type === WalletType.MultiSig) return 'Start Signing';
};

export default SignButtonLabel;
