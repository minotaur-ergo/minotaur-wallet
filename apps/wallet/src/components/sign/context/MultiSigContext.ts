import { createContext } from 'react';
import { MultiSigContextType } from '../../../types/multi-sig-old';

const MultiSigContext = createContext<MultiSigContextType>({
  data: {
    signed: [],
    simulated: [],
    commitments: [[]],
    secrets: [[]],
  },
  rowId: -1,
  requiredSign: -1,
  password: '',
  setPassword: () => null,
  setData: () => null,
});

export { MultiSigContext };
