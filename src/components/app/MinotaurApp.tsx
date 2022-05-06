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
    const style = `.MuiAppBar-root{
     padding-top: ${marginTop}px; 
}
.MuiToolbar-root{
    padding-top: ${marginTop}px;
}
.MuiAppBar-root .MuiToolbar-root{
    padding-top: 0;
}`
    return (
        <ThemeProvider theme={getTheme("light")}>
            <style type="text/css">
                {style}
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
