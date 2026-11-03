import { useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';

import useCommittedAddress from '@/hooks/multi-sig/useActionAddress';
import useMultiSigAddressHolders from '@/hooks/multi-sig/useMultiSigAddressHolders';
import { useMultiSigTxState } from '@/hooks/multi-sig/useMultiSigTxState';
import useMyAction from '@/hooks/multi-sig/useMyAction';
import { useSignerWalletState } from '@/hooks/multi-sig/useSignerWallet';

import LoadingPage from '../../loading-page/LoadingPage';
import { MultiSigDataContext } from './MultiSigDataContext';

interface MultiSigDataContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const MultiSigDataContextHandler = (
  props: MultiSigDataContextHandlerPropsType,
) => {
  // const context = useContext(MultiSigContext);
  const { holders: addresses, loaded: addressesLoaded } =
    useMultiSigAddressHolders(props.wallet);
  const actions = useCommittedAddress(addresses);
  const state = useMultiSigTxState(actions);
  const signer = useSignerWalletState(props.wallet);
  const related = signer.wallet;
  const myAction = useMyAction(actions, related);
  const [needPassword, setNeedPassword] = useState(true);
  // until signer keys and signer wallet are loaded the signing state is
  // unknown, and the page would show commitment controls by mistake
  if (!addressesLoaded || !signer.loaded) {
    return (
      <LoadingPage
        title={'Loading'}
        description={'Checking transaction status, please wait'}
      />
    );
  }
  return (
    <MultiSigDataContext.Provider
      value={{
        addresses,
        actions,
        lastInState: state.last,
        state: state.state,
        myAction,
        related,
        needPassword,
        setNeedPassword,
      }}
    >
      {props.children}
    </MultiSigDataContext.Provider>
  );
};

export default MultiSigDataContextHandler;
