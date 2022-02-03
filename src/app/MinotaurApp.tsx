import React from 'react';
import 'reflect-metadata';
import './MinotaurApp.css';
import DatabaseComponent from './Database/Database';
import { Provider } from 'react-redux';
import { store } from '../store';
import WalletRouter from '../router/WalletRouter';

const MinotaurApp = () => {
    return (
        <DatabaseComponent>
            <Provider store={store}>
                <WalletRouter />
            </Provider>
        </DatabaseComponent>
    );
};

export default MinotaurApp;
