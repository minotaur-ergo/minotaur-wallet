import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import Wallet from "../db/entities/Wallet";
import { reduceTransaction } from "../action/blockchain";
import * as wasm from "ergo-lib-wasm-browser";
import { getWalletAddresses } from "../db/action/address";
import RequestQrcodeDisplay from "./RequestQrcodeDisplay";
import { show_notification } from "../utils/utils";
import Loading from "./Loading";
import { UnsignedGeneratedTx } from "../utils/interface";

interface PropsType {
    transaction?: UnsignedGeneratedTx;
    wallet: Wallet;
    close: (openScanner: boolean) => any;
    display: boolean;
}

const SendConfirmReadonly = (props: PropsType) => {
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
                reduceTransaction(transaction, boxes, data_input, props.wallet.network_type).then(reduced => {
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
                    show_notification(error);
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

export default SendConfirmReadonly;
