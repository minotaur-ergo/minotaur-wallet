import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js/dist/sql-wasm";
import { createConnection } from "typeorm";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import Splash from "../Splash";
import entities from "../../db/entities";

const connectSqlJs = async () => {
    window.SQL = await initSqlJs({
        // locateFile: file => `./${file}`,
        locateFile: file => `https://sql.js.org/dist/${file}`
    });
    return await createConnection({
        type: "sqljs",
        autoSave: true,
        location: "minotaur",
        logging: ["error"],
        synchronize: true,
        entities: entities,
        sqlJsConfig: { useBigInt: true }
    });
};

const connectCapacitor = async () => {
    const sqliteConnection = await new SQLiteConnection(CapacitorSQLite);
    try {
        return await createConnection({
            type: "capacitor",
            database: "minotaur",
            driver: sqliteConnection,
            logging: "all",
            synchronize: true,
            entities: entities
            // migrations: [
            //     "src/db/migration/**/*.ts"
            // ]
        });
    } catch (exp) {
        console.log(exp);
        throw exp;
    }
};

const connectDb = async () => {
    if (Capacitor.getPlatform() === "web") {
        // if(isElectron()) {
        //     return connectElectron();
        // }else{
        return connectSqlJs();
        // }
    }
    return connectCapacitor();
};

interface PropsType {
    children?: React.ReactNode | React.ReactNodeArray;
}

const downloadDb = () => {
    try {
        const content = Buffer.from(JSON.parse(localStorage.minotaur).map((item: number) => ("0" + item.toString(16)).slice(-2)).join(""), "hex");
// any kind of extension (.txt,.cpp,.cs,.bat)
        const filename = "db.sqlite3";

        const blob = new Blob([content], {
            type: "octet/stream"
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (e) {

    }
};
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
                    }, 1000);
                });
            }, 3000);
        }

    }, [connecting, connected]);
    return (
        <>
            {/*<button onClick={() => downloadDb()}>download database</button>*/}
            {connected ? props.children : <Splash />}
        </>
    );
};

export default Database;
