import React  from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterSwitch from './RouterSwitch';
import { connect, MapDispatchToProps } from 'react-redux';
import { GlobalStateType } from "../../store/reducer";
import { WalletAction } from "../../action/action";
import { loadBlockChainData } from "../../store/asyncAction";
import { loadConfig } from '../../store/actions';

interface PropsType {
    walletsValid: boolean;
    loadConfig: () => any;
}
interface StateType {
    loading: boolean;
}
class WalletRouter extends React.Component<PropsType, StateType>{
    state: StateType = {
        loading: false
    }

    checkWallet = () => {
        if(!this.props.walletsValid && !this.state.loading) {
            this.setState({loading: true})
            WalletAction.loadWallets().then(() => this.setState({loading: false})).catch((error) => {
                console.log(error)
                setTimeout(() => this.setState({loading: false}), 5000)
            });
        }
    }
    componentDidMount = () => {
        loadBlockChainData();
        this.props.loadConfig();
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

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    loadConfig: () => dispatch(loadConfig())
});


export default connect(mapStateToProps, mapDispatchToProps)(WalletRouter);

