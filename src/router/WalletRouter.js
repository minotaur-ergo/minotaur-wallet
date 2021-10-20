import { BrowserRouter } from 'react-router-dom'
import RouterSwitch, {RouteMap} from './RouterSwitch';
// import TransactionPage from "../api/wallet/transaction-tab/TransactionTab";
// import WalletPage from "../api/wallet/WalletPage";
// import AddressView from "../api/address/AddressView";


const getRoute = (route, args) => {
  Object.entries(args).forEach(([key, value]) => {
    route = route.replace(":" + key, value);
  })
  return route;
}

function WalletRouter() {
  return (
    <BrowserRouter>
      <RouterSwitch/>
    </BrowserRouter>
  );
}

export { RouteMap, getRoute };
export default WalletRouter;
