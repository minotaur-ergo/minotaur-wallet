import React from 'react'
import WalletAddHeader from './WalletAddHeader';
import WalletAddBody from "./WalletAddBody";
import WithAppBar from "../../layout/WithAppBar";


const WalletAdd = props => {
    return (
        <WithAppBar header={<WalletAddHeader title="Add Wallet"/>}>
            <WalletAddBody/>
        </WithAppBar>
    )
}


export default WalletAdd;
