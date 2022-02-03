import React from "react";
import { QrCodePropsType } from "./propsType";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { ScanResult } from "@capacitor-community/barcode-scanner/dist/esm/definitions";
import { show_notification } from "../../utils/utils";


class QrCodeReaderCapacitor extends React.Component<QrCodePropsType, {}> {


    checkPermission = async () => {
        // check or request permission
        const status = await BarcodeScanner.checkPermission({ force: true });
        console.log(status)
        if (status.granted) {
            // the user granted permission
            return true;
        }

        return false;
    };
    start = async () => {
        if(await this.checkPermission()) {
            await BarcodeScanner.hideBackground();
            const result: ScanResult = await BarcodeScanner.startScan();
            if (result.hasContent && result.content) {
                this.props.handleScan(result.content);
            } else {
                this.props.handleError();
            }
        }else{
            await show_notification("No permission to use camera");
        }
    };
    stop = async () => {
        await BarcodeScanner.stopScan();
        await BarcodeScanner.showBackground();
    };

    componentWillUnmount() {
        this.stop().then(() => null);
    }

    componentDidMount() {
        console.log("component started");
        this.start().then(() => null).catch(() => this.props.handleError());
    }

    render = () => {
        return <div/>;
    };
}

export default QrCodeReaderCapacitor;
