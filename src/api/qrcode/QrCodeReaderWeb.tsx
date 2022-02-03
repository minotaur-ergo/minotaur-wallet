import React from "react";
import QrReader from "react-qr-reader";
import { qrCodePropsType } from "./PropsType";
import AppHeader from "../../header/AppHeader";
import { connect, MapDispatchToProps } from "react-redux";
import { hideQrCodeScanner } from "../../store/actions";
import WithAppBar from "../../layout/WithAppBar";

interface QrCodeWebPropsType extends qrCodePropsType {
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


const mapStateToProps = () => ({});


const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    closeQrcode: () => dispatch(hideQrCodeScanner())
});


export default connect(mapStateToProps, mapDispatchToProps)(QrCodeReaderWeb);
