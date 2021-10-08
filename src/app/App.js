import React from "react";
import Database from "../db/Database";
import WalletRouter from "../router/WalletRouter";

function App() {
    return (
        <Database>
            <WalletRouter/>
        </Database>
    );
}

export default App;
