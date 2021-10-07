import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from '../../components/Erg';
import { getRoute, RouteMap } from "../../router/WalletRouter";
import { withRouter } from "react-router-dom";


const walletElement = props => {
    const gotoWallet = () => {
        props.history.push(getRoute(RouteMap.WalletTransaction, {"id": props.id}))
    }
    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar>
            {/*        <ImageIcon />*/}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={<Erg value={props.amount.value} showUnit={true}/>}/>
        </ListItem>
    )
}

export default withRouter(walletElement);
