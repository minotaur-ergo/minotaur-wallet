import React from "react";
import { Capacitor } from "@capacitor/core";
import QrCodeReaderWeb from "./QrCodeReaderWeb";
import QrCodeReaderCapacitor from "./QrCodeReaderCapacitor";

interface PropsType {
    success: (scanned: string) => any;
    fail: () => any;
}


const QrCodeReader = (props: PropsType) => {
    if (Capacitor.getPlatform() === "web") {
        return <QrCodeReaderWeb handleScan={props.success} handleError={props.fail} />;
    }
    return <QrCodeReaderCapacitor handleScan={props.success} handleError={props.fail} />;
};

export default QrCodeReader;
