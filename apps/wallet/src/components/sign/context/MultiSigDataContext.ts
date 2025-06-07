import { createContext } from 'react';
import { MultiSigDataContextType, MultiSigStateEnum } from '@/types/multi-sig';

const MultiSigDataContext = createContext<MultiSigDataContextType>({
  addresses: [],
  actions: [],
  state: MultiSigStateEnum.COMMITMENT,
  lastInState: false,
  myAction: { committed: false, signed: false },
  needPassword: false,
  setNeedPassword: () => null,
});

export { MultiSigDataContext };
