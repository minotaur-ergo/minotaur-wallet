import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from "../../components/Erg";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const TransactionElement = props => {
    const gotoWallet = () => {
        // props.history.push(getRoute(RouteMap.WalletTransaction, {"id": props.id}))
    }

    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar>
                    {props.type==='in' ? <AddCircleOutlineIcon/> : <AccountBalanceWalletIcon/>}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={<Erg value={props.amount.erg} showUnit={true}/>}/>
        </ListItem>
    )
}

export default TransactionElement
