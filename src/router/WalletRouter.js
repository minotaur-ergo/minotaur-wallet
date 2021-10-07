import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from "../api/home/Home";
import WalletAdd from "../api/wallet-add/WalletAdd"

const RouteMap = {
    Home: "/",
    WalletAdd: "/wallet/add/"
}

function WalletRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={RouteMap.WalletAdd}>
                    <WalletAdd/>
                </Route>
                <Route path={RouteMap.Home}>
                    <Home/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export { RouteMap };
export default WalletRouter;
