import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'reflect-metadata';
import Splash from './app/Splash'
import safeAreaInsets from "safe-area-insets";
const MinotaurApp = lazy(() => import('./app/MinotaurApp'));

declare global {
  interface Window {
    SQL: any;
  }
}

safeAreaInsets.onChange((style: any) => null);
ReactDOM.render((
  <Suspense fallback={<Splash/>}>
    <MinotaurApp />
  </Suspense>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
