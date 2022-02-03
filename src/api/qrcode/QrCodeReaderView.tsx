import React from "react";
import { failScanResult, hideQrCodeScanner, successScanResult } from "../../store/actions";
import { connect, MapDispatchToProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import QrCodeReader from "./QrCodeReader";
import { GlobalStateType } from "../../store/reducer";
import { detectType, TxPublishR, TxSignR } from "./qrcode-types/QrCodeScanResult";
import QrCodeMoreChunk from "./qrcode-types/QrCodeMoreChunk";
import TransactionSignRequest from "./qrcode-types/TransactionSignRequest";
import TransactionPublishRequest from "./qrcode-types/TransactionPublishRequest";
import { JsonBI } from "../../config/json";
import { show_notification } from "../../utils/utils";

interface PropsType extends RouteComponentProps {
    closeQrcode: () => any;
    success: (scanned: string) => any;
    fail: () => any;
}

interface StateType {
    scanning: boolean;
    type: string;
    chunks: Array<string>;
}

const parametersRegex = new RegExp(/^(?<name>[A-Za-z]+)(\/(?<page>[0-9]+)\/(?<total>[0-9]+))?-(?<tx>.*)$/);

class QrCodeReaderView extends React.Component<PropsType, StateType> {
    state = {
        scanning: true,
        type: "",
        chunks: []
    };
    success = (scanned: string) => {
        const match = scanned.match(parametersRegex);
        const group = match && match.groups ? match.groups : {
            name: "",
            page: undefined,
            total: undefined,
            tx: undefined
        };
        const name = group.name;
        const page = group.page ? Number(group.page) : 1;
        const total = group.total ? Number(group.total) : 1;
        const tx = group.tx ? group.tx : "";
        let chunks: Array<string> = [...this.state.chunks];
        const type = detectType(name);
        if (type || this.state.type) {
            if ((type !== this.state.type && this.state.type) || page <= 0 || page > total) {
                show_notification("Invalid Qrcode scanned");
            } else {
                if (this.state.chunks.length === 0) {
                    // fill chunks as empty
                    chunks = Array(total).fill("");
                    chunks[page - 1] = tx;
                } else {
                    if (total !== chunks.length) {
                        show_notification("Invalid Qrcode scanned");
                    } else {
                        chunks[page - 1] = tx;
                    }
                }
                this.setState({ type: type, chunks: chunks, scanning: false });
            }
        } else {
            this.props.success(scanned);
        }
    };

    renderSubComponent = () => {
        switch (this.state.type) {
            case TxSignR:
                return <TransactionSignRequest tx={JsonBI.parse(this.state.chunks.join(""))} />;
            case TxPublishR:
                return <TransactionPublishRequest tx={JsonBI.parse(this.state.chunks.join(""))} />;
        }
        return null;
    };

    render = () => {
        const invalidChunkCount = this.state.chunks.filter(item => !item).length;
        return (
            <React.Fragment>
                {this.state.scanning ? (
                    <QrCodeReader fail={this.props.fail} success={this.success} />
                ) : invalidChunkCount > 0 ? (
                    <QrCodeMoreChunk chunks={this.state.chunks} close={this.props.closeQrcode}
                                     scanNext={() => this.setState({ scanning: true })} />
                ) : this.renderSubComponent()}
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({
    // qrcodeType: state.qrcode.type
});


const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => (
    {
        success: (scanned: string) => dispatch(successScanResult(scanned)),
        fail: () => dispatch(failScanResult()),
        closeQrcode: () => dispatch(hideQrCodeScanner())
    }
);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QrCodeReaderView));
