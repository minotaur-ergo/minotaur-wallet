import React, { useEffect, useState } from 'react'
import { Divider, List } from "@material-ui/core";
import WalletElement from './WalletElement';
import { selectWallet } from "../../db/commands";

const WalletList = props => {
    const [wallets, setWallets] = useState([]);
    useEffect(() => {
        selectWallet().then(wallets => {
            setWallets(wallets)
        })
    }, [])
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


export default WalletList;
