import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Erg from '../../components/Erg';
import { getRoute, RouteMap } from "../../router/WalletRouter";
import { withRouter } from "react-router-dom";


const walletElement = props => {
    const gotoWallet = () => {
        props.history.push(getRoute(RouteMap.WalletRoute, {"id": props.id}))
    }
    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar>
            {/*        <ImageIcon />*/}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={<Erg erg={props.erg} nano_erg={props.nano_erg} showUnit={true}/>}/>
        </ListItem>
    )
}

export default withRouter(walletElement);
