import React  from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterSwitch from './RouterSwitch';
import { loadBlockChainData } from '../store/asyncAction';
import { GlobalStateType } from "../store/reducer";
import { connect } from "react-redux";
import { loadWallets } from "../action/wallet";

interface PropsType {
    walletsValid: boolean;
}
interface StateType {
    loading: boolean;
}
class WalletRouter extends React.Component<PropsType, StateType>{
    state: StateType = {
        loading: false
    }

    checkWallet = () => {
        console.log("start checking wallets", this.state, this.props)
        if(!this.props.walletsValid && !this.state.loading) {
            console.log("try reloading wallets")
            this.setState({loading: true})
            loadWallets().then(() => this.setState({loading: false})).catch((error) => {
                console.log(error)
                setTimeout(() => this.setState({loading: false}), 5000)
            });
        }
    }
    componentDidMount = () => {
        loadBlockChainData();
        this.checkWallet();
    }

    componentDidUpdate = () => {
        this.checkWallet();
    }

    render() {
        return (
            <BrowserRouter>
                <RouterSwitch />
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state: GlobalStateType) => ({
    walletsValid: state.wallet.walletValid
});

export default connect(mapStateToProps)(WalletRouter);

