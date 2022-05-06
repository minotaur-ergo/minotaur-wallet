import React, { useEffect, useState } from "react";
import "reflect-metadata";
import "./MinotaurApp.css";
import Database from "../database/Database";
import { Provider } from "react-redux";
import { store } from "../../store";
import WalletRouter from "../route/WalletRouter";
import { SnackbarProvider } from 'notistack';
import MessageHandler from "./MessageHandler";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloseAction from "./CloseAction";
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Capacitor } from "@capacitor/core";

const getTheme = (mode: "dark" | "light") => {
    return createTheme({
        palette: {
            mode: mode,
            // background: {
            //     paper: "#121212"
            // }
        }
    })
}

const MinotaurApp = () => {
    const [marginTop, setMarginTop] = useState(0);
    useEffect(() => {
        if(Capacitor.getPlatform() === "ios") {
            SafeArea.getSafeAreaInsets().then(inset => {
                setMarginTop(inset.insets.top)
            })
        }
    }, [])
    return (
        <ThemeProvider theme={getTheme("light")}>
            <style>
                {/*.MuiAppBar-root{*/}
                {/*    margin-top: {marginTop}*/}
                {/*}*/}
            </style>
            <Database>
                <Provider store={store}>
                    <WalletRouter/>
                    <SnackbarProvider style={{zIndex: 9999}} maxSnack={10} action={key => <CloseAction msgKey={key}/>}>
                        <MessageHandler/>
                    </SnackbarProvider>
                </Provider>
            </Database>
        </ThemeProvider>
    );
};


export default MinotaurApp;
