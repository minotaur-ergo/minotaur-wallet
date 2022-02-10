import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import Wallet from "../db/entities/Wallet";
import { reduceTransaction, UnsignedGeneratedTx } from "../action/blockchain";
import * as wasm from "ergo-lib-wasm-browser";
import { getWalletAddresses } from "../db/action/address";
import RequestQrcodeDisplay from "./RequestQrcodeDisplay";
import { GlobalStateType } from "../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { showQrCodeScanner } from "../store/actions";
import { show_notification } from "../utils/utils";
import Loading from "./Loading";

interface PropsType {
    transaction?: UnsignedGeneratedTx;
    wallet: Wallet;
    close: () => any;
    openQrCode: () => any;
    display: boolean;
}

const SendConfirmReadonly = (props: PropsType) => {
    const [txLoading, setTxLoading] = useState(false);
    const [txRequest, setTxRequest] = useState<{ req: string, valid: boolean, closed: boolean }>({
        req: "",
        valid: false,
        closed: false
    });
    const close = () => {
        props.openQrCode();
        props.close();
    };
    useEffect(() => {
        if (props.display) {
            if (!txLoading && (!txRequest.valid || txRequest.closed)) {
                setTxLoading(true);
                setTxRequest({ valid: false, req: "", closed: false });
                const transaction: wasm.UnsignedTransaction = props.transaction?.tx as wasm.UnsignedTransaction;
                const boxes: wasm.ErgoBoxes = props.transaction?.boxes!;
                reduceTransaction(transaction, boxes, wasm.ErgoBoxes.from_boxes_json([]), props.wallet.network_type).then(reduced => {
                    getWalletAddresses(props.wallet.id).then(walletAddress => {
                        let inputs = [];
                        for (let index = 0; index < boxes.len(); index++) {
                            inputs.push(Buffer.from(boxes.get(index).sigma_serialize_bytes()).toString("base64"));
                        }
                        const requestJson = {
                            reducedTx: Buffer.from(reduced).toString("base64"),
                            sender: walletAddress[0].address,
                            inputs: inputs
                        };
                        setTxRequest({
                            valid: true,
                            req: JSON.stringify(requestJson),
                            closed: false
                        });
                        setTxLoading(false);
                    });
                }).catch(error => {
                    show_notification(error.message);
                });
            }
        } else {
            if (!txRequest.closed) {
                setTxRequest({ ...txRequest, closed: true });
            }
        }
    }, [props.display, props.transaction, props.wallet, txLoading, txRequest]);
    return (
        <Container>
            <Grid container spacing={2} style={{ textAlign: "center" }}>
                {txRequest.valid ? (
                    <React.Fragment>
                        <Grid item xs={12}>
                            Please scan code below on your cold wallet and generate signed transaction
                        </Grid>
                        <RequestQrcodeDisplay requestType={"CSR"} requestData={txRequest.req} />
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth color="primary" onClick={() => close()}>
                                Scan
                            </Button>
                        </Grid>
                    </React.Fragment>
                ) :  <Loading/>}
            </Grid>
        </Container>
    );
};
const mapStateToProps = (state: GlobalStateType) => ({});


const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    openQrCode: () => dispatch(showQrCodeScanner())
});

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmReadonly);
