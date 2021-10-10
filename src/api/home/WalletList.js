import React, { useEffect } from 'react'
import { Divider, List } from "@material-ui/core";
import WalletElement from './WalletElement';
import { loadWallets } from "../../db/commands/wallet";
import { connect } from "react-redux";
import * as actionTypes from '../../store/actionType';

const WalletList = props => {
    useEffect(() => {
        loadWallets().then(wallets=>props.setWallets(wallets))
    }, [])
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
});

const mapDispatchToProps = dispatch => ({
  setWallets: wallets => dispatch({type: actionTypes.SET_WALLETS, payload: wallets})
})
export default connect(mapStateToProps, mapDispatchToProps)(WalletList);
