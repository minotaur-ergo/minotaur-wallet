const version = 1;

/**
 *  config contains
 *  db version
  * @type {string}
 */
const sql = `
CREATE TABLE "config" (
    "id"                    INTEGER NOT NULL,
    "name"                  TEXT DEFAULT "",
    "value"                 TEXT DEFAULT "",
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "wallet" (
    "id"                    INTEGER NOT NULL,
    "name"                  TEXT DEFAULT "",
    "mnemonic"              TEXT DEFAULT "",
    "type"                  INTEGER DEFAULT 0,
    "last_height"           INTEGER DEFAULT 0,
    "last_update"           INTEGER DEFAULT 0,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "address" (
    "id"                    INTEGER NOT NULL,
    "wallet"        INTEGER,
    "readonly"      INTEGER NOT NULL DEFAULT 0,
    "address"       TEXT UNIQUE,
    "path"          TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
    FOREIGN KEY("wallet") REFERENCES "wallet"("id")
);

CREATE TABLE "asset" (
    "id"        INTEGER NOT NULL,
    "asset_id"  TEXT NOT NULL,
    "name"      TEXT,
    "decimal"   INTEGER,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "transaction" (
    "id"        INTEGER NOT NULL,
    "tx_id"     INTEGER NOT NULL UNIQUE,
    "height"    INTEGER NOT NULL,
    "date"      INTEGER NOT NULL,
    "json"      TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "box" (
    "id"                INTEGER NOT NULL,
    "tx_id"             INTEGER NOT NULL,
    "spend_tx_id"       INTEGER,
    "erg"               INTEGER NOT NULL DEFAULT 0,
    "nano_erg"          INTEGER NOT NULL DEFAULT 0,
    "creation_index"    INTEGER NOT NULL DEFAULT 0,
    "spend_index"       INTEGER DEFAULT 0,
    "address"           INTEGER NOT NULL,
    "box_id"            TEXT NOT NULL,
    "json"            TEXT NOT NULL,
    FOREIGN KEY("address") REFERENCES "address"("id"),
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("tx_id") REFERENCES "transaction"("id"),
    FOREIGN KEY("spend_tx_id") REFERENCES "transaction"("id")
);

CREATE TABLE "box_content" (
    "id"            INTEGER NOT NULL,
    "asset_id"      INTEGER NOT NULL,
    "box_id"        INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("asset_id") REFERENCES "asset"("id"),
    FOREIGN KEY("box_id") REFERENCES "box"("id")
);

INSERT INTO config (name, value) VALUES ('db_version', '${version}')
`;

const checkTableExists = async (database, table) => {
    const query = `SELECT name FROM sqlite_master
                    WHERE type='table' AND name='${table}'
                    ORDER BY name;`
    const cursor = await database.query(query);
    return cursor.values.length !== 0
}

const version1 = async database => {
    if(!await checkTableExists(database, "config")){
        await database.execute(sql);
        await database.createSyncTable()
    }
    return null
}

export default version1;
