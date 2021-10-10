import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from "../api/home/Home";
import WalletAdd from "../api/wallet-add/WalletAdd"
import TransactionPage from "../api/wallet/transaction-tab/TransactionTab";
import WalletPage from "../api/wallet/WalletPage";
import AddressView from "../api/address/AddressView";

const RouteMap = {
  Home: "/",
  WalletAdd: "/wallet/add/",
  WalletRoute: "/wallet/:id/",
  WalletAddressRoute: "/wallet/:id/address/:address_id",
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
        <Route path={RouteMap.WalletAddressRoute}>
          <AddressView/>
        </Route>
        <Route path={RouteMap.WalletRoute}>
          <WalletPage/>
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
