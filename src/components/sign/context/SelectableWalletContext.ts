import { createContext } from 'react';
import { StateWallet } from '../../../store/reducer/wallet';

interface SelectableWalletContextType {
  setWallet: (wallet: StateWallet) => unknown;
  wallet?: StateWallet;
}

const SelectableWalletContext = createContext<SelectableWalletContextType>({
  setWallet: () => null,
});

export { SelectableWalletContext };

export type { SelectableWalletContextType };
