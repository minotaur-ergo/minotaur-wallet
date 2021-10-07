import React from 'react'
import { withRouter } from 'react-router-dom';
import WalletAddHeader from './WalletAddHeader';
import AddWalletBody from "./AddWalletBody";
import WithAppBar from "../../layout/WithAppBar";


const WalletAdd = props => {
    return (
        <WithAppBar header={<WalletAddHeader/>}>
            <AddWalletBody/>
        </WithAppBar>
    )
}


export default WalletAdd;
