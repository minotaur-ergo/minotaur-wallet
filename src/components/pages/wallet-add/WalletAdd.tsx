import React, { useState } from "react";
import WalletAddBody from "./WalletAddBody";
import WithAppBar from "../../../layout/WithAppBar";
import WalletAddHeader from "./WalletAddHeader";
import QrCodeReaderView from "../../qrcode/QrCodeReaderView";
import { CreateWalletQrCodeContext } from "./types";

const WalletAdd = () => {
    const [scanned, setScanned] = useState("");
    const [showQrCode, setShowQrCode] = useState(false);
    const closeView = () => {
        setShowQrCode(false)
    }
    const fail = () => {
        setShowQrCode(false)
    }
    return (
        <QrCodeReaderView
            allowedTypes={[]}
            fail={() => fail()}
            success={(scanned) => setScanned(scanned)}
            open={showQrCode}
            close={() => closeView()}>
            <CreateWalletQrCodeContext.Provider value={{
                qrCode: showQrCode,
                showQrCode: setShowQrCode,
                cleanValue: () => setScanned(""),
                value: scanned
            }}>
                <WithAppBar header={<WalletAddHeader title="Add Wallet"/>}>
                    <WalletAddBody/>
                </WithAppBar>
            </CreateWalletQrCodeContext.Provider>
        </QrCodeReaderView>
    );
};


export default WalletAdd;
