import React  from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterSwitch from './RouterSwitch';
import { loadBlockChainData } from '../store/asyncAction';

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
export default WalletRouter;

