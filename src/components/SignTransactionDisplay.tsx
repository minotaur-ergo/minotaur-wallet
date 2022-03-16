import React, { useState } from "react";
import Wallet, { WalletType } from "../db/entities/Wallet";
import SendConfirmReadonly from "./SendConfirmReadonly";
import SendConfirm from "./SendConfirm";
import { UnsignedGeneratedTx } from "../utils/interface";
import QrCodeReaderView from "./qrcode/QrCodeReaderView";

interface PropsType {
    wallet: Wallet;
    show: boolean;
    close: () => any;
    transaction?: UnsignedGeneratedTx;
}

const SignTransactionDisplay = (props: PropsType) => {
    const [qrcode, setQrcode] = useState(false);
    const [closeAfterComplete, setCloseAfterComplete] = useState(false)
    const close = (showQrCode: boolean) => {
        if(showQrCode){
            setCloseAfterComplete(true)
        }else{
            props.close()
        }
    }
    const closeQrCode = () => {
        if(closeAfterComplete){
            props.close()
        }else{
            setQrcode(false);
        }
    }
    if (props.transaction) {
        if (props.wallet.type === WalletType.ReadOnly) {
            return (
                <QrCodeReaderView
                    success={() => null}
                    fail={() => null}
                    close={closeQrCode}
                    open={qrcode}>
                    <SendConfirmReadonly
                        display={props.show}
                        transaction={props.transaction}
                        close={close}
                        wallet={props.wallet}
                    />
                </QrCodeReaderView>
            );
        }
        return (
            <SendConfirm
                display={props.show}
                transaction={props.transaction}
                close={props.close}
                wallet={props.wallet}
            />
        );
    }
    return null;
};

export default SignTransactionDisplay;