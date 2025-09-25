import { createContext } from 'react';

import {
  ImportProcessingState,
  ImportWalletContextType,
} from '@minotaur-ergo/types';

const ImportWalletContext = createContext<ImportWalletContextType>({
  scan: () => null,
  start: () => null,
  data: [],
  selected: 0,
  status: ImportProcessingState.Pending,
  handleSelection: () => null,
});

export { ImportWalletContext };
