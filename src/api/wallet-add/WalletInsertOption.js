import React from "react";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Restore from '@material-ui/icons/RestorePage';
import { withRouter } from "react-router-dom";
import { faPlus, faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20%',
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


const WalletInsertOption = (props) => {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            <ListItem onClick={() => props.setWalletType("new")}>
                <ListItemAvatar>
                    <Avatar>
                        <FontAwesomeIcon icon={faPlus} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="New wallet"
                              secondary="Generate a random mnemonic and create a wallet with it. It can be a cold wallet or normal wallet"/>
            </ListItem>
            <Divider/>
            <ListItem onClick={() => props.setWalletType("restore")}>
                <ListItemAvatar>
                    <Avatar>
                        <Restore/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Restore wallet" secondary="Restore a wallet from an existing mnemonic. It can be a cold wallet or normal wallet"/>
            </ListItem>
            <Divider/>
            <ListItem onClick={() => props.setWalletType("hot")}>
                <ListItemAvatar>
                    <Avatar>
                        <FontAwesomeIcon icon={faCoffee}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add hot wallet"
                              secondary="this is a read only wallet. do not store any secret. only track incomes. if you want to send transaction you must use a cold wallet to sign it."/>
            </ListItem>
        </List>
    )
}


export default withRouter(WalletInsertOption);
