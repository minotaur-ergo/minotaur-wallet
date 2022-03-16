import React, { createContext, useState } from "react";
import WalletAddHeader from "../../header/WalletAddHeader";
import WalletAddBody from "./WalletAddBody";
import WithAppBar from "../../layout/WithAppBar";
import QrCodeReaderView from "../../components/qrcode/QrCodeReaderView";
import { QrCodeContextType } from "../../components/qrcode/qrcode-types";


export const CreateWalletQrCodeContext = createContext<QrCodeContextType | null>(null);

const WalletAdd = () => {
    const [scanned, setScanned] = useState("");
    const [showQrCode, setShowQrCode] = useState(false);
    return (
        <QrCodeReaderView
            allowedTypes={[]}
            fail={() => setShowQrCode(false)}
            success={(scanned) => setScanned(scanned)}
            open={showQrCode}
            close={() => setShowQrCode(false)}>
            <CreateWalletQrCodeContext.Provider value={{
                qrCode:showQrCode,
                showQrCode: setShowQrCode,
                cleanValue: () => setScanned(""),
                value: scanned
            }}>
                <WithAppBar header={<WalletAddHeader title="Add Wallet" />}>
                    <WalletAddBody />
                </WithAppBar>
            </CreateWalletQrCodeContext.Provider>
        </QrCodeReaderView>
    );
};


export default WalletAdd;
