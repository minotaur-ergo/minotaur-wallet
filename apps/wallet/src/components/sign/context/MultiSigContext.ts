import { createContext } from 'react';
import { MultiSigContextType } from '@/types/multi-sig';

const MultiSigContext = createContext<MultiSigContextType>({
  hints: [[]],
  rowId: -1,
  requiredSign: -1,
  password: '',
  setPassword: () => null,
  setHints: () => null,
});

export { MultiSigContext };
