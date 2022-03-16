import React from "react";
import QrReader from "react-qr-reader";
import { QrCodePropsType } from "./propsType";
import AppHeader from "../../../header/AppHeader";
import WithAppBar from "../../../layout/WithAppBar";

interface QrCodeWebPropsType extends QrCodePropsType {
    closeQrcode: () => any;
}


const QrCodeReaderWeb = (props: QrCodeWebPropsType) => {
    const handleScan = (data: string | null) => {
        if (data) props.handleScan(data);
    };
    return (
        <WithAppBar header={<AppHeader hideQrCode={true} title="Scan Qrcode" back={props.closeQrcode} />}>
            <QrReader
                delay={300}
                onError={props.handleError}
                onScan={handleScan}
            />
        </WithAppBar>
    );
};

export default (QrCodeReaderWeb);
