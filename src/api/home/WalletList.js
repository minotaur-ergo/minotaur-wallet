import React from 'react'
import { Divider, List } from "@material-ui/core";
import WalletElement from './WalletElement';


const wallets = [
    {name: "wallet 1", amount: {value: 2500000000, coin: 'erg'}},
    {name: "wallet 2", amount: {value: 2500000000, coin: 'erg'}},
    {name: "wallet 3", amount: {value: 2500000000, coin: 'erg'}},
    {name: "wallet 4", amount: {value: 2500000000, coin: 'erg'}},
]

const walletList = props => {
    return (
        <List>
            {wallets.map(wallet => (
                <React.Fragment>
                    <WalletElement {...wallet}/>
                    <Divider/>
                </React.Fragment>
            ))}
        </List>
    )
}


export default walletList;
