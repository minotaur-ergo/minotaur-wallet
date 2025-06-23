import { createContext } from 'react';

import * as wasm from 'ergo-lib-wasm-browser';

interface TxSubmitContextType {
  submit: (signed: wasm.Transaction) => unknown;
}

const TxSubmitContext = createContext<TxSubmitContextType>({
  submit: () => null,
});

export default TxSubmitContext;
