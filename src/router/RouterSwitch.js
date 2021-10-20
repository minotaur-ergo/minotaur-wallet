import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import WalletAdd from "../api/wallet-add/WalletAdd";
import Home from "../api/home/Home";
import {App} from '@capacitor/app';
import DApps from "../api/wallet/dapps/DApps";
import Address from "../api/wallet/address/Address";
import AddressView from "../api/wallet/address/AddressView";

const RouteMap = {
    Home: "/",
    WalletAdd: "/wallet/add/",
    WalletTransaction: "/wallet/:id/transaction",
    WalletAddress: "/wallet/:id/address/",
    WalletAddressView: "/wallet/:id/address/:address_id",
    WalletDApps: "/wallet/:id/dapps",
}

const RouterSwitch = props => {
    App.addListener('backButton', () => {
        try{
            // TODO Handle app close in case of no back url available
            props.history.goBack()
        }catch (e){
            App.exitApp();
        }
    })

    return (
        <Switch>
            <Route path={RouteMap.WalletAdd} exact>
                <WalletAdd/>
            </Route>
            <Route path={RouteMap.WalletAddressView}>
              <AddressView/>
            </Route>
            <Route path={RouteMap.WalletAddress} exact>
              <Address/>
            </Route>
            <Route path={RouteMap.WalletDApps} exact>
              <DApps/>
            </Route>
            <Route path={RouteMap.Home} exact>
                <Home/>
            </Route>
        </Switch>

    )
}

export default withRouter(RouterSwitch);
export {RouteMap};
