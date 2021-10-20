import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from '../../components/Erg';
import { getRoute, RouteMap } from "../../router/WalletRouter";
import { withRouter } from "react-router-dom";
import { faCoffee, faWallet, faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const walletElement = props => {
    const gotoWallet = () => {
        props.history.push(getRoute(RouteMap.WalletDApps, {"id": props.id}))
    }
    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar>
                    {props.type === 'cold'? <FontAwesomeIcon icon={faSnowflake} />: null}
                    {props.type === 'normal'? <FontAwesomeIcon icon={faWallet} />: null}
                    {props.type === 'hot'? <FontAwesomeIcon icon={faCoffee} />: null}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={<Erg erg={props.erg} nano_erg={props.nano_erg} showUnit={true}/>}/>
        </ListItem>
    )
}

export default withRouter(walletElement);
