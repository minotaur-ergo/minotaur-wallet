import React, { useEffect } from "react";
import { Divider, List } from "@material-ui/core";
import WalletElement from "./WalletElement";
import { connect } from "react-redux";
import { GlobalStateType } from "../../store/reducer";
import { loadWallets } from "../../action/wallet";
import WalletWithErg from "../../db/entities/views/WalletWithErg";

interface PropsType {
    wallets: Array<WalletWithErg>;
    walletsValid: boolean;
}

const WalletList = (props: PropsType) => {
    useEffect(() => {
        loadWallets().then(() => null);
    });
    return (
        <List>
            {props.wallets.map((wallet, index) => (
                <React.Fragment key={index}>
                    <WalletElement
                        network_type={wallet.network_type}
                        type={wallet.type}
                        id={wallet.id}
                        name={wallet.name}
                        erg={wallet.erg()}
                        tokens={wallet.token_count}/>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

const mapStateToProps = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
    walletsValid: state.wallet.walletValid
});

export default connect(mapStateToProps)(WalletList);
