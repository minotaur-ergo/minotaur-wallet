import React from 'react'
import { Divider, List } from "@material-ui/core";
import WalletElement from './WalletElement';
import {Wallets} from "../../const";

const walletList = props => {
    return (
        <List>
            {Wallets.map(wallet => (
                <React.Fragment>
                    <WalletElement {...wallet}/>
                    <Divider/>
                </React.Fragment>
            ))}
        </List>
    )
}


export default walletList;
