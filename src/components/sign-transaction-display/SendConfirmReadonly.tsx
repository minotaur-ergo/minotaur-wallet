import React, { useEffect, useState } from "react";
import * as wasm from "ergo-lib-wasm-browser";
import { UnsignedGeneratedTx } from "../../util/interface";
import Wallet from "../../db/entities/Wallet";
import { AddressDbAction } from "../../action/db";
import { BlockChainAction } from "../../action/blockchain";
import { Button, Container, Grid } from "@mui/material";
import RequestQrcodeDisplay from "../request-qrcode-display/RequestQrcodeDisplay";
import Loading from "../loading/Loading";
import { GlobalStateType } from "../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { SnackbarMessage, VariantType } from "notistack";
import { showMessage } from "../../store/actions";
import { MessageEnqueueService } from "../app/MessageHandler";

interface SendConfirmReadonlyPropsType extends MessageEnqueueService{
    transaction?: UnsignedGeneratedTx;
    wallet: Wallet;
    close: (openScanner: boolean) => any;
    display: boolean;
}

const SendConfirmReadonly = (props: SendConfirmReadonlyPropsType) => {
    const [txLoading, setTxLoading] = useState(false);
    const [txRequest, setTxRequest] = useState<{ req: string, valid: boolean, closed: boolean }>({
        req: "",
        valid: false,
        closed: false
    });
    const close = (openScanner: boolean) => {
        props.close(openScanner);
    };
    useEffect(() => {
        if (props.display) {
            if (!txLoading && (!txRequest.valid || txRequest.closed)) {
                setTxLoading(true);
                setTxRequest({ valid: false, req: "", closed: false });
                const transaction: wasm.UnsignedTransaction = props.transaction?.tx as wasm.UnsignedTransaction;
                const boxes: wasm.ErgoBoxes = props.transaction?.boxes!;
                const data_input = props.transaction?.data_inputs ? props.transaction.data_inputs : wasm.ErgoBoxes.from_boxes_json([]);
                BlockChainAction.reduceTransaction(transaction, boxes, data_input, props.wallet.network_type).then(reduced => {
                    AddressDbAction.getWalletAddresses(props.wallet.id).then(walletAddress => {
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
                    props.showMessage(`${error}`, "error");
                });
            }
        } else {
            if (!txRequest.closed) {
                setTxRequest({ ...txRequest, closed: true });
            }
        }
    }, [props, props.display, props.transaction, props.wallet, txLoading, txRequest]);
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
                            <Button variant="contained" fullWidth color="primary" onClick={() => close(true)}>
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
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmReadonly);
