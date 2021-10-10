import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from "../api/home/Home";
import WalletAdd from "../api/wallet-add/WalletAdd"
import TransactionPage from "../api/wallet/TransactionTab";
import WalletPage from "../api/wallet/WalletPage";

const RouteMap = {
  Home: "/",
  WalletAdd: "/wallet/add/",
  WalletAddNewHot: "/wallet/add/new/hot/",
  WalletAddNewCold: "/wallet/add/new/cold/",
  WalletAddNewNormal: "/wallet/add/new/normal/",
  WalletAddNewReadOnly: "/wallet/add/new/readonly/",
  WalletAddRestoreCold: "/wallet/add/restore/cold/",
  WalletAddRestoreNormal: "/wallet/add/restore/normal/",
  WalletRoute: "/wallet/:id/"
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
