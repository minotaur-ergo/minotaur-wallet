import React from "react";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import Restore from '@material-ui/icons/RestorePage';
import Search from '@material-ui/icons/Search';

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
                        <AddBox />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Insert new wallet" secondary="Generate a random mnemonic and create a wallet with it" />
            </ListItem>
            <Divider/>
            <ListItem onClick={() => props.setWalletType("restore")}>
                <ListItemAvatar>
                    <Avatar>
                        <Restore />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Restore existing wallet" secondary="Restore a wallet from an existing mnemonic" />
            </ListItem>
            <Divider/>
            <ListItem onClick={() => props.setWalletType("readonly")}>
                <ListItemAvatar>
                    <Avatar>
                        <Search />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add read only wallet" secondary="Add an address to view transaction to it. there is no key stored anywhere for this wallet" />
            </ListItem>
        </List>
    )
}


export default WalletInsertOption;
