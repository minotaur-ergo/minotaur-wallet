import { createContext } from 'react';

import { MultiSigPasswordContextType } from '@minotaur-ergo/types';

const MultiSigPasswordContext = createContext<MultiSigPasswordContextType>({
  password: '',
  setPassword: () => null,
});

export { MultiSigPasswordContext };
