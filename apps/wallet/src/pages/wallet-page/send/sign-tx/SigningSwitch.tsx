import { StateWallet, WalletType } from '@minotaur-ergo/types';

import WalletSignMultiSig from './WalletSignMultiSig';
import WalletSignNormal from './WalletSignNormal';
import WalletSignReadonly from './WalletSignReadonly';

interface SigningSwitchPropsType {
  setHasError: (hasError: boolean) => unknown;
  wallet: StateWallet;
}

const SigningSwitch = (props: SigningSwitchPropsType) => {
  switch (props.wallet.type) {
    case WalletType.Normal:
      return (
        <WalletSignNormal
          wallet={props.wallet}
          setHasError={props.setHasError}
        />
      );
    case WalletType.ReadOnly:
      return (
        <WalletSignReadonly
          wallet={props.wallet}
          setHasError={props.setHasError}
        />
      );
    case WalletType.MultiSig:
      return (
        <WalletSignMultiSig
          wallet={props.wallet}
          networkType={props.wallet.networkType}
          setHasError={props.setHasError}
        />
      );
  }
  return null;
};
export default SigningSwitch;
