import React, { useEffect, useState } from "react";
import { useSQLite } from "react-sqlite-hook/dist";
import { migrate } from "./migrations";
import { Capacitor } from "@capacitor/core";

export let database;

let sqlite;

const createDb = async () => {
  database = await sqlite.createConnection("minatour");
  await database.open()
}

const Database = props => {
  const [existConn, setExistConn] = useState(false);
  const {
    initWebStore, echo, getPlatform, createConnection, closeConnection,
    retrieveConnection, retrieveAllConnections, closeAllConnections,
    addUpgradeStatement, importFromJson, isJsonValid, copyFromAssets,
    isAvailable
  } = useSQLite();
  sqlite = {
    echo: echo,
    getPlatform: getPlatform,
    createConnection: createConnection,
    closeConnection: closeConnection,
    retrieveConnection: retrieveConnection,
    retrieveAllConnections: retrieveAllConnections,
    closeAllConnections: closeAllConnections,
    addUpgradeStatement: addUpgradeStatement,
    importFromJson: importFromJson,
    isJsonValid: isJsonValid,
    initWebStore: initWebStore,
    copyFromAssets: copyFromAssets,
    isAvailable: isAvailable
  };

  useEffect(() => {
    if (!existConn && Capacitor.getPlatform() !== "web") {
      createDb().then(() => {
        migrate(database).then(() => setExistConn(true))
      })
    }
  }, []);
  if (existConn || Capacitor.getPlatform() === "web") {
    return props.children;
  }
  return <div>Loading ... </div>
}

export default Database;
