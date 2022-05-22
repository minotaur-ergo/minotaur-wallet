import React from "react";
import WalletName from "../elements/WalletName";
import Mnemonic from "./Mnemonic";
import MnemonicConfirm from "./MnemonicConfirm";
import { WalletCreate } from "../WalletCreate";
import { Grid, Typography } from "@mui/material";
import { GlobalStateType } from "../../../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { SnackbarMessage, VariantType } from "notistack";
import { showMessage } from "../../../../store/actions";
import WalletNetworkSelect from "../elements/WalletNetworkSelect";

class InsertWallet extends WalletCreate {

    renderName = () => (
        <WalletName
            name={this.state.name}
            goBack={this.props.back}
            goForward={(name) => this.gotoMnemonic(name)}>
            <>
                <Grid item xs={12}>
                    <WalletNetworkSelect network={this.state.network_type} setNetworkType={(new_network) => this.setState({network_type: new_network})} />
                </Grid>
                <Typography>
                    Enter new wallet name:
                </Typography>
                <br/>
            </>
        </WalletName>
    );

    renderMnemonic = () => (
        <Mnemonic
            mnemonic={this.state.mnemonic}
            mnemonic_passphrase={this.state.mnemonic_passphrase}
            goBack={() => this.goBackName()}
            goForward={(mnemonic: string, mnemonic_passphrase: string) => this.goConfirm(mnemonic, mnemonic_passphrase)}/>
    );

    renderConfirm = () => (
        <MnemonicConfirm
            mnemonic={this.state.mnemonic}
            goBack={() => this.setState({step: 1})}
            goForward={this.goPassword}/>

    );
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});
export default connect(mapStateToProps, mapDispatchToProps)(InsertWallet);
