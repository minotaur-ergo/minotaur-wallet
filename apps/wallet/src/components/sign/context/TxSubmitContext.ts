import { createContext } from 'react';

import * as wasm from '@minotaur/ergo-lib';

interface TxSubmitContextType {
  submit: (signed: wasm.Transaction) => unknown;
}

const TxSubmitContext = createContext<TxSubmitContextType>({
  submit: () => null,
});

export default TxSubmitContext;
