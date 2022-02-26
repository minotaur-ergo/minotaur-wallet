import React from "react";
import TokenIssueDApp from "./apps/TokenIssueDApp";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getWalletAddresses } from "../../../action/address";
import { CoveringResult, DAppPropsType } from "../../../utils/interface";
import { getCoveringBoxFor } from "../../../db/action/box";
import { getAddressByAddressString } from "../../../db/action/address";
import Wallet from "../../../db/entities/Wallet";
import * as dbWalletAction from "../../../db/action/wallet";
import { loadWallets } from "../../../action/wallet";
import { GlobalStateType } from "../../../store/reducer";
import { connect } from "react-redux";
import WithAppBar from "../../../layout/WithAppBar";
import AppHeader from "../../../header/AppHeader";
import { apps } from "./dapps";
import Loading from "../../../components/Loading";
import GenerateTransactionBottomSheet from "../../../components/GenerateTransactionBottomSheet";
import { UnsignedGeneratedTx } from "../../../utils/interface";
import { getNetworkType } from "../../../config/network_type";
import SigmaUSD from "./apps/sigmausd/SigmaUSD";
import { getSingleTokenWithAddressForWallet } from "../../../db/action/boxContent";
import IconButton from "@material-ui/core/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import BottomSheet from "../../../components/bottom-sheet/BottomSheet";
import { Container } from "@material-ui/core";

interface PropsType extends RouteComponentProps<{ id: string, dAppId: string }> {
    wallets_valid: boolean;
    wallets: Array<Wallet>;
}

interface StateType {
    wallet?: Wallet;
    wallet_loading: boolean;
    display: boolean;
    transaction?: UnsignedGeneratedTx;
    title?: string;
    show_description: boolean;
}

class DAppView extends React.Component<PropsType, StateType> {
    state: StateType = {
        display: false,
        wallet_loading: false,
        show_description: false,
    };

    loadContent = () => {
        if (!this.props.wallets_valid && !this.state.wallet_loading) {
            this.setState({ wallet_loading: true });
            loadWallets().then(() => {
                this.setState({ wallet_loading: false });
            });
        } else if (this.props.wallets_valid) {
            if (!this.state.wallet || this.state.wallet.id + "" !== this.props.match.params.id) {
                const wallets = this.props.wallets.filter(item => "" + item.id === "" + this.props.match.params.id);
                this.setState({ wallet: wallets[0] });
            }
        }
    };

    getDApp = () => {
        const dApps = apps.filter(item => item.id === this.props.match.params.dAppId);
        return dApps.length ? dApps[0] : null;
    };

    componentDidMount = () => {
        this.loadContent();
    };

    componentDidUpdate = () => {
        this.loadContent();
    };

    getAddresses = (): Promise<Array<string>> => {
        return getWalletAddresses(this.state.wallet?.id!).then(result => result.map(item => item.address));
    };

    getCoveringForErgAndToken = async (amount: bigint, tokens: Array<{ id: string, amount: bigint }>, address?: string): Promise<CoveringResult> => {
        let coveringTokens: { [id: string]: bigint } = {};
        tokens.forEach(item => coveringTokens[item.id] = item.amount);
        const addressObject = address ? (await getAddressByAddressString(address))?.addressObject() : null;
        return getCoveringBoxFor(amount, this.state.wallet?.id!, coveringTokens, addressObject);
    };

    signAndSendTx = async (unsignedTx: UnsignedGeneratedTx) => {
        this.setState({
            transaction: unsignedTx,
            display: true
        });
    };

    closeTransactionView = () => {
        this.setState({ display: false });
    };

    getTokenAmount = async (tokenId?: string) => {
        if (tokenId) {
            const result = await getSingleTokenWithAddressForWallet(this.state.wallet?.id!, tokenId);
            return result.map(item => item.amount()).reduce((a, b) => a + b, BigInt(0));
        } else {
            const walletWithErg = await dbWalletAction.getWalletWithErg(this.state.wallet?.id!);
            return walletWithErg?.erg()!;
        }
    };

    getProps = (): DAppPropsType => {
        return {
            network_type: getNetworkType(this.state.wallet ? this.state.wallet?.network_type : ""),
            getAddresses: this.getAddresses,
            getCoveringForErgAndToken: this.getCoveringForErgAndToken,
            signAndSendTx: this.signAndSendTx,
            getTokenAmount: this.getTokenAmount
        };
    };

    descriptionIcon = () => {
        const dApp = this.getDApp();
        if(dApp && dApp.readme) {
            return (
                <IconButton aria-label="show 17 new notifications" color="inherit" onClick={() => this.setState({show_description: true})}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                </IconButton>
            )
        }
        return null
    }

    render = () => {
        const dApp = this.getDApp();
        if (dApp && this.state.wallet) {
            return (
                <WithAppBar header={<AppHeader title={dApp.name} hideQrCode={true} extraIcons={this.descriptionIcon()}/>}>
                    {dApp.id === "issueToken" ? (
                        <TokenIssueDApp {...this.getProps()} />
                    ) : null}
                    {dApp.id === "sigmaUsd" ? (
                        <SigmaUSD {...this.getProps()} />
                    ) : null}
                    {this.state.wallet ? (
                        <GenerateTransactionBottomSheet
                            show={this.state.display}
                            close={this.closeTransactionView}
                            wallet={this.state.wallet}
                            transaction={this.state.transaction} />
                    ) : null}
                    {dApp && dApp.readme ? (
                        <BottomSheet show={this.state.show_description} close={() => this.setState({show_description: false})}>
                            <Container>
                            {dApp.readme}
                                <br/>
                                <br/>
                                <br/>
                            </Container>
                        </BottomSheet>
                    ) : null}
                </WithAppBar>
            );
        } else {
            return <Loading />;
        }
    };
}

const mapsPropsToDispatch = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
    wallets_valid: state.wallet.walletValid
});

export default connect(mapsPropsToDispatch)(withRouter(DAppView));
