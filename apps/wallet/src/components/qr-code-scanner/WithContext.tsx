import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, StateWallet } from '@minotaur-ergo/types';

import { SelectableWalletContext } from '@/components/sign/context/SelectableWalletContext';
import TxSignContextHandler from '@/components/sign/context/TxSignContextHandler';

interface WithContextPropsType {
  children: React.ReactNode;
  close: () => unknown;
}

const WithContext = (props: WithContextPropsType) => {
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  const storeWallet = (newWallet: StateWallet) => {
    if (wallet === undefined || wallet.id !== newWallet.id) {
      setWallet(newWallet);
    }
  };
  const firstWallet = useSelector(
    (state: GlobalStateType) => state.wallet.wallets[0],
  );
  const usedWallet = useMemo(
    () => (wallet === undefined ? firstWallet : wallet),
    [firstWallet, wallet],
  );
  return (
    <SelectableWalletContext.Provider
      value={{ setWallet: storeWallet, wallet: usedWallet }}
    >
      <TxSignContextHandler
        denySubmit={true}
        wallet={usedWallet}
        close={props.close}
      >
        {props.children}
      </TxSignContextHandler>
    </SelectableWalletContext.Provider>
  );
};

export default WithContext;
