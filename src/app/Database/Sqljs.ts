import initSqlJs from 'sql.js/dist/sql-wasm';
import isElectron from "is-electron";


const Sqljs = async () => {
    const SQL = await initSqlJs({
        // locateFile: file => `./${file}`,
        locateFile: file => `https://sql.js.org/dist/${file}`,
    });
    if(isElectron()){
        const db = new SQL.Database();

        // SQL.Database.dbOpen = function (databaseFileName) {
        //     try {
        //         return new SQL.Database(fs.readFileSync(databaseFileName))
        //     } catch (error) {
        //         console.log("Can't open database file.", error.message)
        //         return null
        //     }
        // }
        //
        // SQL.dbClose = function (databaseHandle, databaseFileName) {
        //     try {
        //         let data = databaseHandle.export()
        //         let buffer = Buffer.alloc(data.length, data)
        //         fs.writeFileSync(databaseFileName, buffer)
        //         databaseHandle.close()
        //         return true
        //     } catch (error) {
        //         console.log("Can't close database file.", error)
        //         return null
        //     }
        // }
    }
}

export default Sqljs
