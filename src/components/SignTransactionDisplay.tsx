import React, { useContext } from "react";
import Wallet, { WalletType } from "../db/entities/Wallet";
import SendConfirmReadonly from "./SendConfirmReadonly";
import SendConfirm from "./SendConfirm";
import { UnsignedGeneratedTx } from "../utils/interface";
import { QrCodeContextType } from "./qrcode/qrcode-types";

interface PropsType {
    wallet: Wallet;
    show: boolean;
    completed: (result: string) => any;
    close: () => any;
    transaction?: UnsignedGeneratedTx;
    contextType: React.Context<QrCodeContextType | null>;
}

const SignTransactionDisplay = (props: PropsType) => {
    const context = useContext(props.contextType);
    const close = (showQrCode: boolean) => {
        if (showQrCode && context) {
            context.showQrCode(true);
        }
        props.close();
    };
    if (props.transaction) {
        if (props.wallet.type === WalletType.ReadOnly) {
            return (
                <SendConfirmReadonly
                    display={props.show}
                    transaction={props.transaction}
                    close={close}
                    wallet={props.wallet}
                />
            );
        }
        return (
            <SendConfirm
                display={props.show}
                completed={props.completed}
                transaction={props.transaction}
                close={props.close}
                wallet={props.wallet}
            />
        );
    }
    return null;
};

export default SignTransactionDisplay;