import React from "react";
import QrCodeReader from "./reader/QrCodeReader";
import QrCodeMoreChunk from "./qrcode-types/QrCodeMoreChunk";
import { show_notification } from "../../utils/utils";
import Types from "./qrcode-types";

interface PropsType {
    success: (scanned: string) => any;
    fail: () => any;
    close: () => any;
    open: boolean;
    children: React.ReactNode;
    allowedTypes?: Array<string>
}

interface StateType {
    scanning: boolean;
    type: string;
    chunks: Array<string>;
    open: boolean;
}

class QrCodeReaderView extends React.Component<PropsType, StateType> {
    state = {
        scanning: true,
        type: "",
        chunks: [],
        open: false
    };

    updateOpen = () => {
        if (this.state.open !== this.props.open) {
            this.setState({
                open: this.props.open,
                type: "",
                chunks: [],
                scanning: true
            });
        }
    };

    componentDidMount = () => {
        this.updateOpen();
    };

    componentDidUpdate = () => {
        this.updateOpen();
    };

    success = (scanned: string) => {
        let selectedTypes = Types.filter(item => item.detect(scanned) !== null);
        if(this.props.allowedTypes){
            selectedTypes = selectedTypes.filter(item => this.props.allowedTypes?.indexOf(item.type)! >= 0);
        }
        if (selectedTypes.length > 0) {
            const selectedType = selectedTypes[0];
            const chunk = selectedType.detect(scanned);
            let chunks: Array<string> = [...this.state.chunks];
            const total = chunk?.total!;
            const page = chunk?.page!;
            if ((selectedType.type !== this.state.type && this.state.type) || page <= 0 || page > total) {
                show_notification("Invalid Qrcode scanned");
            } else {
                if (this.state.chunks.length === 0) {
                    chunks = Array(total).fill("");
                    chunks[page - 1] = chunk?.payload!;
                } else {
                    if (total !== chunks.length) {
                        show_notification("Invalid Qrcode scanned");
                    } else {
                        chunks[page - 1] = chunk?.payload!;
                    }
                }
            }
            this.setState({ type: selectedType.type, chunks: chunks, scanning: false });
        } else {
            this.props.success(scanned);
        }
    };

    renderSubComponent = () => {
        const selectedType = Types.filter(item => item.type === this.state.type);
        if (selectedType.length > 0) {
            return selectedType[0].render(this.state.chunks.join(""), this.props.close);
        }
        return null;
    };

    render = () => {
        const invalidChunkCount = this.state.chunks.filter(item => !item).length;
        return (
            <React.Fragment>
                {!this.state.open ? null : this.state.scanning ? (
                    <QrCodeReader closeQrCode={this.props.close} fail={this.props.fail} success={this.success} />
                ) : invalidChunkCount > 0 ? (
                    <QrCodeMoreChunk
                        chunks={this.state.chunks}
                        close={this.props.close}
                        scanNext={() => this.setState({ scanning: true })} />
                ) : this.renderSubComponent()}
                <div style={{ display: this.state.open ? "none" : "block" }}>
                    {this.props.children}
                </div>
            </React.Fragment>
        );
    };
}

export default QrCodeReaderView;
