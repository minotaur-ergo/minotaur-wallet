import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from '../../components/Erg';


const walletElement = props => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
            {/*        <ImageIcon />*/}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={<Erg value={props.amount.value} showUnit={true}/>}/>
        </ListItem>
    )
}

export default walletElement;
