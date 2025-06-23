import ReactDOM from 'react-dom/client';

import * as wasm from 'ergo-lib-wasm-browser';
import 'reflect-metadata';

import AppTheme from './components/app-theme/AppTheme';
import MinotaurApp from './components/app/MinotaurApp';
import './index.css';
import './setupShim';

// const addressVerified = wasm.Address.from_base58("9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR").to_base58(wasm.NetworkPrefix.Mainnet)
//
// const msg = `If you want to tip the developer for making this app, thanks in advance! Send your tips to ${addressVerified}`
//
console.debug(
  'If you want to tip the developer for making this app, thanks in advance! Send your tips to 9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR',
);
console.log(wasm);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppTheme>
    <MinotaurApp />
  </AppTheme>,
);
