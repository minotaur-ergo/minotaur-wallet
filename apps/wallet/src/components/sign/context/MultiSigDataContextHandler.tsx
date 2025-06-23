import { MultiSigDataContext } from './MultiSigDataContext';
import { StateWallet } from '@minotaur-ergo/types';
import useMultiSigAddressHolders from '@/hooks/multi-sig/useMultiSigAddressHolders';
import useCommittedAddress from '@/hooks/multi-sig/useActionAddress';
import { useMultiSigTxState } from '@/hooks/multi-sig/useMultiSigTxState';
import useMyAction from '@/hooks/multi-sig/useMyAction';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import { useState } from 'react';

interface MultiSigDataContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const MultiSigDataContextHandler = (
  props: MultiSigDataContextHandlerPropsType,
) => {
  // const context = useContext(MultiSigContext);
  const addresses = useMultiSigAddressHolders(props.wallet);
  const actions = useCommittedAddress(addresses);
  const state = useMultiSigTxState(actions);
  const myAction = useMyAction(actions);
  const related = useSignerWallet(props.wallet);
  const [needPassword, setNeedPassword] = useState(true);
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
