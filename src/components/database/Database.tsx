import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js/dist/sql-wasm";
import { DataSource } from "typeorm";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import Splash from "../splash/Splash";
import entities from "../../db/entities";
import migrations from "../../db/migration";
import { initializeAction } from "../../action/db";
import { loadConfig } from '../../store/actions';

let dataSource: DataSource;

declare global {
    interface Window {
        SQL: any;
    }
}

export interface DatabasePropsType {
    children?: React.ReactNode;
}

const connectSqlJs = async () => {
    window.SQL = await initSqlJs({
        locateFile: file => `/${file}`,
    });
    dataSource = new DataSource({
        type: "sqljs",
        autoSave: true,
        location: "minotaur",
        logging: false,
        entities: entities,
        migrations: migrations,
        synchronize: false
    })
    await dataSource.initialize()
    await dataSource.runMigrations({transaction: "each"})
    return dataSource
};

const connectCapacitor = async () => {
    const sqliteConnection = await new SQLiteConnection(CapacitorSQLite);
    try {
        dataSource = new DataSource({
            type: "capacitor",
            database: "minotaur",
            driver: sqliteConnection,
            logging: false,
            synchronize: false,
            entities: entities,
            migrations: migrations,
        })
        await dataSource.initialize()
        await dataSource.runMigrations({transaction: "each"})
        return dataSource;
    } catch (exp) {
        console.log(exp);
        throw exp;
    }
};

const connectDb = async () => Capacitor.getPlatform() === "web" ? connectSqlJs() : connectCapacitor();

const Database = (props: DatabasePropsType) => {
    const [connected, setConnected] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    useEffect(() => {
        if (!connecting && !connected) {
            setConnecting(true);
            setTimeout(() => {
                connectDb().then(dataSource => {
                    initializeAction(dataSource);
                    setTimeout(async () => {
                        setConnected(true);
                        setConnecting(false);
                    }, 100);
                }).catch(exp => {
                    console.log(exp);
                    setConnected(true);
                    setConnecting(false)
                });
            }, 300);
        }

    }, [connecting, connected]);
    return (
          <>
            {connected ? props.children : <Splash/>}
        </>
    );
};

export default Database;

export {
    dataSource
}