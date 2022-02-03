import React from "react";
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import WalletAdd from "../api/wallet-add/WalletAdd";
import Home from "../api/home/Home";
import { App } from "@capacitor/app";
import WalletPage from "../api/wallet/WalletPage";
import QrCodeReaderView from "../api/qrcode/QrCodeReaderView";
import { connect, MapDispatchToProps } from "react-redux";
import { hideQrCodeScanner } from "../store/actions";
import { GlobalStateType } from "../store/reducer";
import DAppView from "../api/wallet/dapps/DAppView";

const RouteMap = {
    Home: "/",
    WalletAdd: "/wallet/add/",
    Wallet: "/wallet/:id/",
    WalletTransaction: "/wallet/:id/transaction",
    WalletSend: "/wallet/:id/send",
    WalletAddress: "/wallet/:id/address/",
    WalletAssets: "/wallet/:id/assets/",
    WalletAddressView: "/wallet/:id/address/:address_id",
    WalletDApps: "/wallet/:id/dApp",
    WalletDAppView: "/wallet/:id/dApp/:dAppId",
    QrCode: "/qrcode"
};

interface PropsType extends RouteComponentProps {
    showQrCodeScanner: boolean;
    closeQrcode: () => any;
}

class RouterSwitch extends React.Component<PropsType, {}> {
    appBackButtonListener = () => {
        if (this.props.showQrCodeScanner) {
            this.props.closeQrcode();
        } else {
            try {
                if (this.props.history.location.pathname === "/") {
                    App.exitApp();
                } else {
                    this.props.history.goBack();
                }
            } catch (e) {
                App.exitApp();
            }
        }
    };
    componentDidMount = () => {
        App.addListener("backButton", this.appBackButtonListener);
    };

    render = () => {
        return (
            <React.Fragment>
                {this.props.showQrCodeScanner ? <QrCodeReaderView /> : null}
                <div style={{ display: this.props.showQrCodeScanner ? "none" : "block" }}>
                    <Switch>
                        <Route path={RouteMap.WalletAdd} exact>
                            <WalletAdd />
                        </Route>
                        <Route path={RouteMap.WalletDAppView} exact>
                            <DAppView />
                        </Route>
                        <Route path={RouteMap.Wallet}>
                            <WalletPage />
                        </Route>
                        <Route path={RouteMap.Home} exact>
                            <Home />
                        </Route>
                        <Route>
                            <Home />
                        </Route>
                    </Switch>
                </div>
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({
    showQrCodeScanner: state.qrcode.show
});


const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    closeQrcode: () => dispatch(hideQrCodeScanner())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RouterSwitch));
export { RouteMap };
