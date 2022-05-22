import React from "react";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Restore from "@mui/icons-material/RestorePage";
import { faCoffee, faPlus, faGroupArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WalletCreateType } from "./walletCreateType";


interface PropsType {
    setWalletType: (walletType: WalletCreateType) => any;
}

const WalletInsertOption = (props: PropsType) => {

    return (
        <List style={{marginTop: "100px"}}>
            <ListItem onClick={() => props.setWalletType(WalletCreateType.New)}>
                <ListItemAvatar>
                    <Avatar>
                        <FontAwesomeIcon icon={faPlus} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="New wallet"
                    secondary="Generate a random mnemonic and create a wallet with it. It can be a cold wallet or normal wallet" />
            </ListItem>
            <Divider />
            <ListItem onClick={() => props.setWalletType(WalletCreateType.Restore)}>
                <ListItemAvatar>
                    <Avatar>
                        <Restore />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="Restore wallet"
                    secondary="Restore a wallet from an existing mnemonic. It can be a cold wallet or normal wallet" />
            </ListItem>
            <Divider />
            <ListItem onClick={() => props.setWalletType(WalletCreateType.ReadOnly)}>
                <ListItemAvatar>
                    <Avatar>
                        <FontAwesomeIcon icon={faCoffee} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="Add read only wallet"
                    secondary="this is a read only wallet. do not store any secret. only track incomes. if you want to send transaction you must use a cold wallet to sign it." />
            </ListItem>
            <Divider />
            <ListItem onClick={() => props.setWalletType(WalletCreateType.MultiSig)}>
                <ListItemAvatar>
                    <Avatar>
                        <FontAwesomeIcon icon={faGroupArrowsRotate} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="Add multi sig wallet"
                    secondary="???" />
            </ListItem>
        </List>
    );
};


export default WalletInsertOption;
