import React, { useEffect, useState } from 'react'
import { Divider, List } from "@material-ui/core";
import WalletElement from './WalletElement';
import { connect } from "react-redux";
import * as actionTypes from '../../store/actionType';
import { loadWallet } from "../../db/action/Wallet";

const WalletList = props => {
    const [walletLoading, setWalletLoading] = useState(false);
    useEffect(() => {
        if (!props.walletsValid && !walletLoading) {
            setWalletLoading(true);
            loadWallet().then(() => {
                setWalletLoading(false)
            })
        }
    }, [walletLoading]);
    return (
        <List>
            {props.wallets.map((wallet, index) => (
                <React.Fragment key={index}>
                    <WalletElement {...wallet}/>
                    <Divider/>
                </React.Fragment>
            ))}
        </List>
    )
}

const mapStateToProps = state => ({
    wallets: state.wallets,
    walletsValid: state.valid.wallet,
});

export default connect(mapStateToProps)(WalletList);
