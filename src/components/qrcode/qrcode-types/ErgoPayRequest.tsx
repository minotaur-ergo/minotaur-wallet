import React, { createContext } from "react";
import AppHeader from "../../app-header/AppHeader";
import WithAppBar from "../../../layout/WithAppBar";
import * as wasm from "ergo-lib-wasm-browser";
import { Container, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { ADDRESS_URL_PLACE_HOLDER } from "../../../util/const";
import Loading from "../../loading/Loading";
import Wallet from "../../../db/entities/Wallet";
import { GlobalStateType } from "../../../store/reducer";
import { connect } from "react-redux";
import DisplayId from "../../display-id/DisplayId";
import { useMatch } from 'react-router-dom'
import BottomSheet from "../../bottom-sheet/BottomSheet";
// import SignTransactionDisplay from "../../../components/SignTransactionDisplay";
import { UnsignedGeneratedTx } from "../../../util/interface";
import { JsonBI } from "../../../util/json";
import { getNetworkType, NetworkType } from "../../../util/network_type";
import QrCodeReaderView from "../QrCodeReaderView";
import { QrCodeContextType } from "./types";
import { TxPublishR } from "./QrCodeScanResult";
import { AddressDbAction } from "../../../action/db";
import { RouteMap } from "../../route/routerMap";
import TxView from "../../display-tx/TxView";


const ip_regex = RegExp("^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.(?!$)|$)){4}$");


interface PropsType {
    closeQrcode: () => any;
    wallets: Array<Wallet>;
    completed?: (result: string) => any;
    url: string;
}

interface stateType {
    url?: wasm.Transaction;
    loadedUrl: string;
    status: "Address" | "Display" | "Loading";
    addresses: Array<string>;
    selectedAddress: string;
    error: string;
    response?: ErgoPayResponse;
    wallet?: Wallet;
    showSignModal: boolean;
    scanned: string;
    showQrCode: boolean;
    tx?: UnsignedGeneratedTx;
}

interface ErgoPayResponse {
    reducedTx?: string;
    p2pkaddress?: string;
    message?: string;
    messageSeverity?: "INFORMATION" | "WARNING" | "ERROR";
    replyToUrl?: string;
}

export const ErgoPayQrCodeContext = createContext<QrCodeContextType | null>(null);


class ErgoPayRequest extends React.Component<PropsType, stateType> {
    state: stateType = {
        loadedUrl: "",
        selectedAddress: "",
        addresses: [],
        status: "Display",
        error: "",
        showSignModal: false,
        scanned: "",
        showQrCode: false
    };

    getUrlWithPrefix = (url: string) => {
        if (url.indexOf("://") >= 0) {
            url = url.split("://", 1)[1];
        }
        let hostname = url.split("/")[0];
        if (hostname.indexOf(":") >= 0) {
            hostname = hostname.split(":")[0];
        }
        return ((hostname === "localhost" || ip_regex.test(hostname)) ? "http://" : "https://") + url;
    };

    urlContainPlaceHolder = (url: string) => {
        return url.indexOf(ADDRESS_URL_PLACE_HOLDER) >= 0;
    };

    getUrl = () => {
        const url = this.getUrlWithPrefix(this.props.url);
        if (this.state.selectedAddress && this.urlContainPlaceHolder(this.props.url)) {
            return url.replace(ADDRESS_URL_PLACE_HOLDER, this.state.selectedAddress);
        } else {
            return url;
        }
    };

    loadUrl = () => {
        const url = this.getUrl();
        if (this.state.addresses.length === 0) {
            if (this.state.status !== "Loading") {
                this.setState({status: "Loading"});
                const match = useMatch(RouteMap.Wallet);
                const walletId = match?.params.id!;
                const wallet = this.props.wallets.filter(wallet => wallet.id + "" === walletId);
                if (wallet.length === 0) {
                    this.setState({"error": "Invalid Wallet"});
                } else {
                    AddressDbAction.getWalletAddresses(wallet[0].id).then(addresses => {
                        this.setState({
                            status: "Display",
                            addresses: addresses.map(item => item.address),
                            wallet: wallet[0]
                        });
                    });
                }
            }
        } else if (this.state.status !== "Loading" && this.state.loadedUrl !== url) {
            const network_type = getNetworkType(this.state.wallet?.network_type!);
            if (this.urlContainPlaceHolder(url)) {
                if (this.state.status !== "Address")
                    this.setState({status: "Address", selectedAddress: ""});
            } else {
                this.setState({status: "Loading"});
                axios.get<ErgoPayResponse>(url).then(response => {
                    const data = response.data;
                    if (data.reducedTx) {
                        this.getTransaction(data.reducedTx, network_type).then(tx => {
                            this.setState({
                                response: response.data,
                                status: "Display",
                                loadedUrl: url,
                                error: "",
                                tx: tx
                            });
                        });
                    } else {
                        this.setState({
                            response: response.data,
                            status: "Display",
                            loadedUrl: url,
                            error: ""
                        });
                    }
                }).catch(error => {
                    this.setState({
                        status: "Display",
                        error: error,
                        loadedUrl: url
                    });
                });
            }
        }
    };

    handleSelectAddress = (address: string) => {
        this.setState({selectedAddress: address});
    };

    componentDidMount() {
        this.loadUrl();
    }

    componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<stateType>, snapshot?: any) {
        this.loadUrl();
    }

    getTransaction = async (txBytes: string, network_type: NetworkType): Promise<UnsignedGeneratedTx> => {
        const unsignedTx = wasm.ReducedTransaction.sigma_parse_bytes(
            Uint8Array.from(Buffer.from(txBytes, "base64"))
        ).unsigned_tx();
        let input_boxes: wasm.ErgoBoxes = wasm.ErgoBoxes.from_boxes_json([]);
        for (let index = 0; index < unsignedTx.inputs().len(); index++) {
            const input = unsignedTx.inputs().get(index);
            const boxJson = await network_type.getExplorer().getBoxById(input.box_id().to_str());
            input_boxes.add(wasm.ErgoBox.from_json(JsonBI.stringify(boxJson)));
        }
        let data_boxes: wasm.ErgoBoxes = wasm.ErgoBoxes.from_boxes_json([]);
        for (let index = 0; index < unsignedTx.data_inputs().len(); index++) {
            const input = unsignedTx.data_inputs().get(index);
            const boxJson = await network_type.getExplorer().getBoxById(input.box_id().to_str());
            data_boxes.add(wasm.ErgoBox.from_json(JsonBI.stringify(boxJson)));
        }
        return {
            tx: unsignedTx,
            boxes: input_boxes,
            data_inputs: data_boxes
        };
    };

    completed = (txId: string) => {
        if (this.state.response && this.state.response.replyToUrl) {
            axios.post(this.state.response.replyToUrl, {"txId": txId}).then(() => {
                this.props.closeQrcode();
            });
        } else {
            this.props.closeQrcode();
        }
    };

    render = () => {
        return (
            <QrCodeReaderView
                completed={this.completed}
                allowedTypes={[TxPublishR]}
                fail={() => this.setState({showQrCode: false})}
                success={(scanned) => this.setState({scanned: scanned})}
                open={this.state.showQrCode}
                close={() => this.setState({showQrCode: false})}>
                <ErgoPayQrCodeContext.Provider value={{
                    qrCode: this.state.showQrCode,
                    showQrCode: (value: boolean) => this.setState({showQrCode: value}),
                    value: this.state.scanned,
                    cleanValue: () => this.setState({scanned: ""})
                }}>
                    <WithAppBar
                        header={<AppHeader hideQrCode={true} title="ErgoPay Request" back={this.props.closeQrcode}/>}>
                        {this.state.error ? (
                            <Container style={{marginTop: 20}}>
                                <Typography color="secondary">
                                    {this.state.error}
                                </Typography>
                            </Container>
                        ) : null}
                        {this.state.status === "Address" ? (
                            <React.Fragment>
                                <Container style={{marginTop: 20}}>
                                    <Typography>
                                        ErgoPay request needs one address. Please select one address to use for it.
                                    </Typography>
                                </Container>
                                <List>
                                    {this.state.addresses.map((address: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <ListItem onClick={() => this.handleSelectAddress(address)}>
                                                <ListItemText primary={<DisplayId id={address}/>}/>
                                            </ListItem>
                                            <Divider/>
                                        </React.Fragment>
                                    ))}
                                </List>
                            </React.Fragment>
                        ) : this.state.status === "Display" ? (
                            <React.Fragment>
                                <Container style={{marginTop: 20}}>
                                    <Typography>
                                        {this.state.response?.message}
                                    </Typography>
                                </Container>
                                {this.state.tx ? (
                                    <TxView
                                        network_type={this.state.wallet ? this.state.wallet.network_type : ""}
                                        tx={this.state.tx.tx as wasm.UnsignedTransaction}
                                        boxes={[]}
                                        addresses={this.state.addresses}>
                                        <Divider/>
                                        <ListItem button onClick={() => this.setState({showSignModal: true})}>
                                            <ListItemText primary="Sign Transaction"/>
                                        </ListItem>
                                        <BottomSheet
                                            show={this.state.showSignModal}
                                            close={() => this.setState({showSignModal: false})}>
                                            {/*<SignTransactionDisplay*/}
                                            {/*    completed={this.completed}*/}
                                            {/*    contextType={ErgoPayQrCodeContext}*/}
                                            {/*    wallet={this.state.wallet!}*/}
                                            {/*    show={this.state.showSignModal}*/}
                                            {/*    transaction={this.state.tx}*/}
                                            {/*    close={() => this.setState({showSignModal: false})}/>*/}
                                        </BottomSheet>
                                    </TxView>
                                ) : null}
                            </React.Fragment>
                        ) : <Loading/>}
                    </WithAppBar>
                </ErgoPayQrCodeContext.Provider>
            </QrCodeReaderView>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets
});

export default connect(mapStateToProps)(ErgoPayRequest);
