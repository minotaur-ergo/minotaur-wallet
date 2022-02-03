import React  from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterSwitch, { RouteMap } from './RouterSwitch';
import { loadBlockChainData } from '../store/asyncAction';


const getRoute = (route: string, args: object) => {
    Object.entries(args).forEach(([key, value]) => {
        route = route.replace(':' + key, value);
    });
    return route;
};

class WalletRouter extends React.Component{
    componentDidMount() {
        loadBlockChainData()
    }

    render() {
        return (
            <BrowserRouter>
                <RouterSwitch />
            </BrowserRouter>
        );
    }
}

export { RouteMap, getRoute };
export default WalletRouter;
