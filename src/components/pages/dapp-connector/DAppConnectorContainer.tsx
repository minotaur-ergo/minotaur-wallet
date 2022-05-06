import React, { useState } from 'react'
import QrCodeReaderView from "../../qrcode/QrCodeReaderView";
import WithAppBar from "../../../layout/WithAppBar";
import DAppConnectorHeader from "./DAppConnectorHeader";
import DAppConnector from "./DAppConnector";


const DAppConnectorContainer = () => {
    const [scanned, setScanned] = useState("");
    const [showQrCode, setShowQrCode] = useState(false);
    const scanCompleted = () => {
        setScanned("");
        setShowQrCode(false);
    }
    return (
        <QrCodeReaderView
            fail={() => setShowQrCode(false)}
            success={(scanned) => setScanned(scanned)}
            allowedTypes={[]}
            open={showQrCode}
            close={() => setShowQrCode(false)}>
            <WithAppBar header={<DAppConnectorHeader openQrCode={() => setShowQrCode(true)}/>}>
                <DAppConnector value={scanned} clearValue={scanCompleted}/>
            </WithAppBar>
        </QrCodeReaderView>
    )
}

export default DAppConnectorContainer;