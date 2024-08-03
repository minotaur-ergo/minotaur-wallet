import { MultiSigDataContext } from './MultiSigDataContext';
import { StateWallet } from '@/store/reducer/wallet';
import useMultiSigAddressHolders from '@/hooks/multi-sig/useMultiSigAddressHolders';
import useCommittedAddress from '@/hooks/multi-sig/useCommittedAddress';
import useSignedAddresses from '@/hooks/multi-sig/useSignedAddresses';
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
  const committed = useCommittedAddress(addresses);
  const signed = useSignedAddresses(addresses);
  const state = useMultiSigTxState(committed, signed);
  const myAction = useMyAction(committed, signed);
  const related = useSignerWallet(props.wallet);
  const [needPassword, setNeedPassword] = useState(true);
  return (
    <MultiSigDataContext.Provider
      value={{
        addresses,
        committed,
        signed,
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
