import React from "react";
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import WalletAdd from "../api/wallet-add/WalletAdd";
import Home from "../api/home/Home";
import { App } from "@capacitor/app";
import WalletPage from "../api/wallet/WalletPage";
import DAppView from "../api/wallet/dapps/DAppView";
import { RouteMap } from "./routerMap";
import { GlobalStateType } from "../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { closeQrCodeScanner } from "../store/actions";

interface PropsType extends RouteComponentProps {
    qrCodes: Array<string>;
    closeQrcode: (id: string) => any;
}

class RouterSwitch extends React.Component<PropsType, {}> {
    appBackButtonListener = () => {
        if(this.props.qrCodes.length > 0){
            this.props.closeQrcode(this.props.qrCodes[this.props.qrCodes.length - 1])
        }else {
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
                <div>
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
    qrCodes: state.qrcode.pages
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    closeQrcode: (id: string) => dispatch(closeQrCodeScanner(id))
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RouterSwitch));
