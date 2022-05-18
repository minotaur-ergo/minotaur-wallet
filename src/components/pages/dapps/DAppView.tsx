import React from "react";
import TokenIssueDApp from "./apps/TokenIssueDApp";
import Wallet from "../../../db/entities/Wallet";
import { GlobalStateType } from "../../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { apps } from "./dapps";
import SigmaUSD from "./apps/sigmausd/SigmaUSD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import BottomSheet from "../../../components/bottom-sheet/BottomSheet";
import { CoveringResult, DAppPropsType, UnsignedGeneratedTx } from "../../../util/interface";
import { AddressDbAction, BoxContentDbAction, BoxDbAction, WalletDbAction } from "../../../action/db";
import { getNetworkType } from "../../../util/network_type";
import IconButton from "@mui/material/IconButton";
import WithAppBar from "../../../layout/WithAppBar";
import AppHeader from "../../app-header/AppHeader";
import { Container } from "@mui/material";
import Loading from "../../loading/Loading";
import { SnackbarMessage, VariantType } from "notistack";
import { showMessage } from "../../../store/actions";
import { MessageEnqueueService } from "../../app/MessageHandler";
import { useParams } from "react-router-dom";
import GenerateTransactionBottomSheet from "../../generate-transaction-bottom-sheet/GenerateTransactionBottomSheet";
import { WalletQrCodeContext } from "../wallet/types";
import { QrCodeContextType } from "../../qrcode/qrcode-types/types";

interface DAppViewPropsType extends MessageEnqueueService{
    wallet: Wallet;
    setTab: () => any;
    dAppId?: string;
    context: QrCodeContextType;
}

interface DAppViewWrappedPropsType extends MessageEnqueueService{
    wallet: Wallet;
    setTab: () => any;
}

interface DAppViewStateType {
    display: boolean;
    transaction?: UnsignedGeneratedTx;
    title?: string;
    show_description: boolean;
    scan_qr_code: boolean
    scan_callback?: (scanned: string) => any;
}

class DAppView extends React.Component<DAppViewPropsType, DAppViewStateType> {
    state: DAppViewStateType = {
        display: false,
        show_description: false,
        scan_qr_code: false
    };

    static contextType = WalletQrCodeContext;
    componentDidMount() {
        this.props.setTab();
    }

    componentDidUpdate() {
        this.props.setTab();
        if(this.state.scan_qr_code && this.props.context && this.props.context.value){
            if(this.state.scan_callback)
                this.state.scan_callback(this.props.context.value);
            this.setState({
                scan_callback: undefined,
                scan_qr_code: false
            })
            this.props.context.cleanValue();
            this.props.context.showQrCode(false);
        }
    }

    getDApp = () => {
        const dApps = apps.filter(item => item.id === this.props.dAppId);
        return dApps.length ? dApps[0] : null;
    };

    getAddresses = (): Promise<Array<string>> => {
        return AddressDbAction.getWalletAddresses(this.props.wallet.id).then(result => result.map(item => item.address));
    };

    getCoveringForErgAndToken = async (amount: bigint, tokens: Array<{ id: string, amount: bigint }>, address?: string): Promise<CoveringResult> => {
        let coveringTokens: { [id: string]: bigint } = {};
        tokens.forEach(item => coveringTokens[item.id] = item.amount);
        const addressObject = address ? (await AddressDbAction.getAddressByAddressString(address))?.addressObject() : null;
        return BoxDbAction.getCoveringBoxFor(amount, this.props.wallet.id, coveringTokens, addressObject ? [addressObject] : null);
    };

    signAndSendTx = async (unsignedTx: UnsignedGeneratedTx) => {
        this.setState({
            transaction: unsignedTx,
            display: true
        });
    };

    closeTransactionView = () => {
        this.setState({
            display: false,
        });
        setTimeout(() => this.setState({transaction: undefined}), 900)
    };

    getTokenAmount = async (tokenId?: string) => {
        if (tokenId) {
            const result = await BoxContentDbAction.getSingleTokenWithAddressForWallet(this.props.wallet.id, tokenId);
            return result.map(item => item.amount()).reduce((a, b) => a + b, BigInt(0));
        } else {
            const walletWithErg = await WalletDbAction.getWalletWithErg(this.props.wallet.id);
            return walletWithErg?.erg()!;
        }
    };

    startScanQrCode = (callback: (response: string) => any) => {
        this.props.context.showQrCode(true);
        this.setState({scan_qr_code: true, scan_callback: callback})
    }

    getProps = (): DAppPropsType => {
        return {
            network_type: getNetworkType(this.props.wallet.network_type),
            getAddresses: this.getAddresses,
            getCoveringForErgAndToken: this.getCoveringForErgAndToken,
            signAndSendTx: this.signAndSendTx,
            getTokenAmount: this.getTokenAmount,
            showNotification: this.props.showMessage,
            scanQrCode: this.startScanQrCode,
        };
    };

    descriptionIcon = () => {
        const dApp = this.getDApp();
        if(dApp && dApp.readme) {
            return (
                <IconButton color="inherit" onClick={() => this.setState({show_description: true})}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                </IconButton>
            )
        }
        return null
    }

    render = () => {
        const dApp = this.getDApp();
        if (dApp) {
            return (
                <WithAppBar header={<AppHeader title={dApp.name} hideQrCode={true} extraIcons={this.descriptionIcon()}/>}>
                    {dApp.id === "issueToken" ? (
                        <TokenIssueDApp {...this.getProps()} />
                    ) : null}
                    {dApp.id === "sigmaUsd" ? (
                        <SigmaUSD {...this.getProps()} />
                    ) : null}
                    <GenerateTransactionBottomSheet
                        show={this.state.display}
                        close={this.closeTransactionView}
                        wallet={this.props.wallet}
                        transaction={this.state.transaction} />
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

DAppView.contextType = WalletQrCodeContext;

const DAppViewWrapped = (props: DAppViewWrappedPropsType) => {
    const params = useParams<{dAppId: string}>()
    return (
        <WalletQrCodeContext.Consumer>
            {value => (
                <DAppView context={value!} wallet={props.wallet} setTab={props.setTab} dAppId={params.dAppId} showMessage={props.showMessage}/>
            )}
        </WalletQrCodeContext.Consumer>
    )
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppViewWrapped);

