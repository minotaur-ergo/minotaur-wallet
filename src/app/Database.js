import React, { useState, useEffect } from "react";
import Splash from "./Splash";
import initSqlJs from 'sql.js/dist/sql-wasm';
import { createConnection, getConnection } from 'typeorm'
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { entities } from "../db/entities";
import { getLastAddress } from "../db/action/Address";

const connectSqlJs = async () => {
    window.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    });
    return await createConnection({
        type: "sqljs",
        autoSave: true,
        location: "browser",
        logging: ["error", "query", "schema"],
        synchronize: true,
        entities: entities
    })
}

const connectCapacitor = async () => {
    const sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    return await createConnection({
        type: 'capacitor',
        database: 'test',
        driver: sqliteConnection,
        logging: ["error", "query", "schema"],
        synchronize: true,
        entities: entities
    })
}

const connectDb = async () => {
    // let connected = false;
    // try{
    //     connected = getConnection().isConnected
    // }catch (e){
    //
    // }
    // if(connected) {
        if (Capacitor.getPlatform() === "web")
            return connectSqlJs()
        return connectCapacitor()
    // }
}

const Database = props => {
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    useEffect(() => {
        if (!connecting && !connected) {
            setConnecting(true);
            connectDb().then(() => {
                setTimeout(() => {
                    setConnected(true);
                    setConnecting(false);
                }, 1000)
            });
        }
    }, [connecting, connected])
    if (connected) {
        return props.children;
    }
    return (
        <Splash/>
    )
}

export default Database;
