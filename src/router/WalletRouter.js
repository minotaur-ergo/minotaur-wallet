import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from "../api/home/Home";
import WalletAdd from "../api/wallet-add/WalletAdd"
import TransactionPage from "../api/wallet/TransactionPage";

const RouteMap = {
    Home: "/",
    WalletAdd: "/wallet/add/",
    WalletTransaction: "/wallet/:id/transaction/"
}

const getRoute = (route, args) => {
    Object.entries(args).forEach(([key, value]) => {
        route = route.replace(":" + key, value);
    })
    return route;
}

function WalletRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={RouteMap.WalletAdd}>
                    <WalletAdd/>
                </Route>
                <Route path={RouteMap.WalletTransaction}>
                    <TransactionPage/>
                </Route>
                <Route path={RouteMap.Home}>
                    <Home/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export { RouteMap, getRoute };
export default WalletRouter;
