import React, { useEffect } from "react";
import WalletRouter from "../router/WalletRouter";
import Database from "./Database";
import { Provider } from "react-redux";
import { store } from "../store";

const MinotaurApp = props => {
    useEffect(() => {
    }, [])
    return (
        <Database>
            <Provider store={store}>
                <WalletRouter/>
            </Provider>
        </Database>
    );
}

export default MinotaurApp;
