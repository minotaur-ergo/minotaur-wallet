import { createContext } from 'react';

import { MultiSigContextType } from '@minotaur-ergo/types';

const MultiSigContext = createContext<MultiSigContextType>({
  hints: [[]],
  rowId: -1,
  requiredSign: -1,
  password: '',
  setPassword: () => null,
  setHints: () => null,
  setSigned: () => null,
});

export { MultiSigContext };
