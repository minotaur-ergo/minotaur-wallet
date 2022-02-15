import React, { useState } from "react";
import WalletInsertOption from "./WalletInsertOption";
import InsertWallet from "./insert/InsertWallet";
import RestoreWallet from "./restore/RestoreWallet";
import ReadOnlyWallet from "./readonly/ReadOnlyWallet";
import { WalletCreateType } from "./walletCreateType";

const WalletAddBody = () => {
    const [walletType, setWalletType] = useState<WalletCreateType | null>(null);
    return (
        <React.Fragment>
            {walletType === null ? <WalletInsertOption setWalletType={setWalletType} /> : null}
            {walletType === WalletCreateType.New ? <InsertWallet back={() => setWalletType(null)} /> : null}
            {walletType === WalletCreateType.Restore ? <RestoreWallet back={() => setWalletType(null)} /> : null}
            {walletType === WalletCreateType.ReadOnly ? <ReadOnlyWallet back={() => setWalletType(null)} /> : null}
        </React.Fragment>
    );

};

export default WalletAddBody;

export {
    WalletCreateType
};
