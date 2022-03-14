import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js/dist/sql-wasm";
import { createConnection } from "typeorm";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import Splash from "../Splash";
import entities from "../../db/entities";
import migrations from "../../db/migration";


const connectSqlJs = async () => {
    window.SQL = await initSqlJs({
        locateFile: file => `/${file}`,
        // locateFile: file => `https://sql.js.org/dist/${file}`
    });
    const connection = await createConnection({
        type: "sqljs",
        autoSave: true,
        location: "minotaur",
        logging: ["error"],
        synchronize: true,
        entities: entities,
        // migrations: migrations
    });
    // await connection.runMigrations();
    return connection;
};

const connectCapacitor = async () => {
    const sqliteConnection = await new SQLiteConnection(CapacitorSQLite);
    try {
        const connection = await createConnection({
            type: "capacitor",
            database: "minotaur",
            driver: sqliteConnection,
            logging: "all",
            synchronize: false,
            entities: entities,
            migrations: migrations
        });
        await connection.runMigrations();
        return connection;
    } catch (exp) {
        console.log(exp);
        throw exp;
    }
};

const connectDb = async () => Capacitor.getPlatform() === "web" ? connectSqlJs() : connectCapacitor();

interface PropsType {
    children?: React.ReactNode | React.ReactNodeArray;
}

const Database = (props: PropsType) => {
    const [connected, setConnected] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    useEffect(() => {
        if (!connecting && !connected) {
            setConnecting(true);
            setTimeout(() => {
                connectDb().then(connection => {
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
            {connected ? props.children : <Splash />}
        </>
    );
};

export default Database;
