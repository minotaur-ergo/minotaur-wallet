import React from "react";
import Wallet, { WalletType } from "../db/entities/Wallet";
import SendConfirmReadonly from "./SendConfirmReadonly";
import SendConfirm from "./SendConfirm";
import { UnsignedGeneratedTx } from "../utils/interface";

interface PropsType {
    wallet: Wallet;
    show: boolean;
    close: () => any;
    transaction?: UnsignedGeneratedTx;
}

const SignTransactionDisplay = (props: PropsType) => {
    if(props.transaction) {
        if (props.wallet.type === WalletType.ReadOnly) {
            return (
                <SendConfirmReadonly
                    display={props.show}
                    transaction={props.transaction}
                    close={props.close}
                    wallet={props.wallet}
                />
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
    return null
};

export default SignTransactionDisplay;