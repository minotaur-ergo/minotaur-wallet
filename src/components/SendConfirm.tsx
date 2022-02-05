import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "./PasswordInput";
import Wallet from "../db/entities/Wallet";
import { signTx, UnsignedGeneratedTx } from "../action/blockchain";
import node from "../network/node";
import { Browser } from "@capacitor/browser";
import { EXPLORER_FRONT_URL } from "../config/const";
import DisplayId from "./DisplayId";
import { show_notification } from "../utils/utils";

interface PropsType {
    close: () => any;
    wallet: Wallet;
    transaction?: UnsignedGeneratedTx;
    display: boolean;
}

const SendConfirm = (props: PropsType) => {
    const [password, setPassword] = useState("");
    const [txResponse, setTxResponse] = useState("");
    const sendTx = () => {
        if (props.transaction) {
            signTx(props.wallet, props.transaction, password).then(signedTx => {
                node.sendTx(signedTx).then(result => {
                    setTxResponse(result.txId);
                }).catch(exp => {
                    show_notification(exp);
                });
            }).catch(error => {
                show_notification(error);
            });
        }
    };
    const passwordValid = () => {
        return true;
    };
    return (
        <Container>
            <Grid container spacing={2}>
                {txResponse ? (
                    <Grid item xs={12}>
                        <br />
                        Your transaction is generated and submitted to network.
                        <br />
                        <br />
                        <div
                            onClick={() => Browser.open({ url: `${EXPLORER_FRONT_URL}/en/transactions/${txResponse}` })}>
                            <DisplayId id={txResponse} />
                        </div>
                        <br />
                        It can take about 2 minutes to mine your transaction. also syncing your wallet may be slow
                        <br />
                        <br />
                    </Grid>
                ) : (
                    <React.Fragment>
                        <Grid item xs={12}>
                            Please enter your mnemonic passphrase to send transaction
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                label="Wallet password"
                                error=""
                                password={password}
                                setPassword={setPassword} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth color="primary" onClick={sendTx}
                                    disabled={!props.transaction && passwordValid()}>
                                Send
                            </Button>
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </Container>
    );
};

export default SendConfirm;
